import KeyLabel, { Zone } from "@lib/keyLabel"
import TouchGesture, { InitGestureSegmentType } from "@lib/touchGesture"
import { useRef, useContext, useEffect, useState, Dispatch, SetStateAction, RefObject, JSX } from "react"
import { PageCanvasCtx } from "@context/pageCanvasCtx"
import { CanvasSpace, Circle } from "pts"
import KeyMap from "@lib/keyMap"
import { TextAreaEditCtx } from "@context/textAreaCtx"
import { KeyGridCtx, ModifierKeyListener } from "@context/keyGridCtx"
import { Direction } from "@lib/orientation"
import { isTouchScreen } from "@lib/platform"
import { KeyboardInstance, KeyboardSize, KeyIndex } from "@lib/keyboardDefinition"
import KeyGrid from "./keyGrid"
import KeyStroke from "@lib/keyStroke"
import { ConfigCtx, configListenerName } from "@context/configCtx"
import { ConfigEvalMode } from "@lib/control"
import KeyZoneLabel from "./keyZoneLabel"
import { KeyDefinition } from "@lib/keyDefinition"

export default function KeyCell(
  { index, activateKeyGrid }: {
    index: KeyIndex
    activateKeyGrid: RefObject<() => void>
  }
) {
  const self = useRef(null as unknown as HTMLDivElement)
  const [gesture, setGesture] = useState(null as TouchGesture|null)
  const [isShift, setIsShift] = useState(false)
  const [isCapsLock, setIsCapsLock] = useState(false)
  const [gestureSegment, setGestureSegment] = useState(
    {} as {segment?: InitGestureSegmentType, direction?: Direction}
  )
  const [embedGrid, setEmbedGrid] = useState(null as JSX.Element|null)
  const canvas = useContext(PageCanvasCtx)
  const textAreaEdit = useContext(TextAreaEditCtx)
  const keyGridState = useContext(KeyGridCtx)
  const configCtx = useContext(ConfigCtx)
  const [label, setLabel] = useState(
    configCtx.keyboardInstance?.keyboard.getKey(index.row, index.col)?.label 
    || new KeyLabel()
  )
  const [map, setMap] = useState(
    configCtx.keyboardInstance?.keyboard.getKey(index.row, index.col)?.map 
    || new KeyMap()
  )

  const getGestureSegmentLength = () => (
    Math.min(self.current!.clientWidth, self.current!.clientHeight) * 0.4
  )

  function onGesture(gesture: TouchGesture) {
    const keys = map.getKeys(gesture, true, true)

    if (keys instanceof KeyStroke) {
      console.info(`keystroke=${keys} for gesture=${gesture}`)
      const target = document.activeElement || document

      // dispatch to eval composer
      const { closedKeyboard } = keys.dispatch(
        target === textAreaEdit.current.target.current ? textAreaEdit.current : undefined, 
        keyGridState.current
      )
      if (closedKeyboard) {
        gesture.cancel()
      }
    }
    else if (keys instanceof KeyboardInstance) {
      if (keys) {
        console.info(`keyboard=${keys.keyboard.name} for gesture=${gesture}`)

        if (configCtx.mode === ConfigEvalMode.Eval) {
          switch (keys.size) {
            case KeyboardSize.Fill:
              keyGridState.current.addKeyGrid(
                keys, 
                false, 
                activateKeyGrid.current
              )
              break

            case KeyboardSize.Embed:
              if (!embedGrid) {
                setEmbedGrid(
                  <KeyGrid
                    keyboard={keys}
                    onClose={() => setEmbedGrid(null)}
                    persistance={keys.persistance}
                    // don't enable configure of a child keyboard until context switch is explicitly requested by user
                    configurable={false} />
                )
              }
              break
          }
        }
        else {
          console.info(
            `suppress auto launch of child key grid ${keys.keyboard.name} `
            + `while in config mode`
          )
        }
      }
    }
    else {
      console.info(`no mapping for gesture=${gesture}`)
    }

    if (configCtx.mode === ConfigEvalMode.Config) {
      // load in config
      configCtx.loadKey(index, gesture, keys)
    }

    setGestureSegment({})
  }

  const onGestureSegment = (
    label.pseudoZoneCardinalSwipeDefined 
    ? (segment: InitGestureSegmentType, direction: Direction) => { setGestureSegment({segment, direction}) } 
    : undefined
  )

  // draw gesture
  useEffect(
    () => {
      let space: CanvasSpace|undefined
      if (canvas.current && gesture) {
        // console.info('use canvas')
        space = new CanvasSpace(canvas.current)
        space.background = 'transparent'
        const form = space.getForm()

        // animation
        space.add((_time, _ftime) => {
          space!.clear('transparent')

          if (gesture.points.length > 1) {
            form
            .strokeOnly('#fffa', getGestureSegmentLength() * 0.05, 'round', 'round')
            .line(gesture.points)
          }

          for (const p of gesture.points) {
            form
            .fillOnly('#09fa')
            .circle(Circle.fromCenter(
              p,
              getGestureSegmentLength() * 0.1
            ))
          }

          if (gesture.complete) {
            space!.stop()
          }
        })

        space.play()
      }

      return () => { space?.removeAll() }
    }, 
    [gesture]
  )

  // listen to modifier keys
  useEffect(
    () => {
      const mkeyListeners: [Set<ModifierKeyListener>, Dispatch<SetStateAction<boolean>>][] = []

      if (label.pseudoZoneShiftDefined || label.pseudoZoneCapsLockDefined) {
        keyGridState.current.shiftListeners.add(setIsShift)
        mkeyListeners.push([keyGridState.current.shiftListeners, setIsShift])

        keyGridState.current.capsLockListeners.add(setIsCapsLock)
        mkeyListeners.push([keyGridState.current.capsLockListeners, setIsCapsLock])
      }

      return () => { 
        mkeyListeners.forEach(([ls, l]) => ls.delete(l))
      }
    },
    [label]
  )

  // listen to mouse and touch events
  useEffect(
    () => {
      const start = (e: TouchEvent|MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setGesture(TouchGesture.create(
          e, 
          getGestureSegmentLength(),
          map,
          onGesture, 
          onGestureSegment
        ))
      }

      const move = (e: TouchEvent|MouseEvent) => {
        if (gesture && !gesture.complete) {
          e.preventDefault()
          e.stopPropagation()
          gesture.update(e)
        }
      }

      const end = (e: TouchEvent|MouseEvent) => {
        if (gesture && !gesture.complete) {
          e.preventDefault()
          e.stopPropagation()
          gesture?.update(e)
        }
      }

      const setMouseHover = () => {
        if (gesture && !gesture.complete) {
          keyGridState.current.mouseHoverKeyCell.current = self.current
        }
      }
      const unsetMouseHover = () => {
        if (keyGridState.current.mouseHoverKeyCell.current === self.current) {
          keyGridState.current.mouseHoverKeyCell.current = null
        }
      }

      if (isTouchScreen()) {
        self.current?.addEventListener('touchstart', start)
        self.current?.addEventListener('touchmove', move)
        self.current?.addEventListener('touchend', end)
      }
      else {
        self.current?.addEventListener('mousedown', start)
        self.current?.addEventListener('mousemove', move)
        self.current?.addEventListener('mouseup', end)
        self.current?.addEventListener('mouseup', unsetMouseHover)
        self.current?.addEventListener('mouseleave', setMouseHover)
        self.current?.addEventListener('mouseenter', unsetMouseHover)
      }

      return () => {
        if (isTouchScreen()) {
          self.current?.removeEventListener('touchstart', start)
          self.current?.removeEventListener('touchmove', move)
          self.current?.removeEventListener('touchend', end)
        }
        else {
          self.current?.removeEventListener('mousedown', start)
          self.current?.removeEventListener('mousemove', move)
          self.current?.removeEventListener('mouseup', end)
          self.current?.removeEventListener('mouseup', unsetMouseHover)
          self.current?.removeEventListener('mouseleave', setMouseHover)
          self.current?.removeEventListener('mouseenter', unsetMouseHover)
        }
      }
    },
    [gesture]
  )

  // read key config updates
  useEffect(
    () => {
      const name = configListenerName(KeyCell.name + `[${index.col},${index.row}]`)
      configCtx.addSaveListener(name, KeyDefinition.name, () => {
        if (
          configCtx.keyboardInstance
          && configCtx.keyIndex?.col === index.col && configCtx.keyIndex.row === index.row
        ) {
          setLabel(
            configCtx.keyboardInstance.keyboard.getKey(index.row, index.col)?.label 
            || new KeyLabel()
          )

          setMap(
            configCtx.keyboardInstance.keyboard.getKey(index.row, index.col)?.map 
            || new KeyMap()
          )
        }
      })

      return () => configCtx.deleteSaveListener(name, KeyDefinition.name)
    },
    []
  )

  return (
    <div className='relative grow' >
      <div 
        className={[
          'top-0 left-0 right-0 bottom-0',
          'absolute'
        ].join(' ')} >
        {/* key cell */}
        <div
          ref={self}
          className={[
            'dark:bg-zinc-900 dark:hover:bg-zinc-800 bg-zinc-100 hover:bg-zinc-200',
            'select-none',
            'grow h-full',
            'grid grid-cols-3',
            'rounded-lg',
            embedGrid ? 'hidden' : 'flex'
          ].join(' ')} >
          {(['upleft', 'up', 'upright', 'left', 'center', 'right', 'downleft', 'down', 'downright'] as Zone[]).map(
            (zone) => (
              <KeyZoneLabel key={zone} zone={zone} label={label} isShift={isShift} isCapsLock={isCapsLock} gestureSegment={gestureSegment} />
            )
          )}
        </div>

        {/* embed grid */}
        { embedGrid ? embedGrid : undefined }
      </div>
    </div>
  )
}