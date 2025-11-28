import KeyLabel, { GestureSegment, Zone } from "@lib/keyLabel"
import TouchGesture from "@lib/touchGesture"
import { useRef, useContext, useEffect, useState, Dispatch, SetStateAction, RefObject, JSX } from "react"
import { PageCanvasCtx } from "@context/pageCanvasCtx"
import { CanvasSpace, Circle } from "pts"
import KeyMap from "@lib/keyMap"
import { TextAreaEditCtx } from "@context/textAreaCtx"
import { KeyGridCtx, ModifierKeyListener } from "@context/keyGridCtx"
import { isTouchScreen } from "@lib/platform"
import { KeyboardInstance, KeyboardSize, KeyIndex } from "@lib/keyboardDefinition"
import KeyGrid from "./keyGrid"
import KeyStroke from "@lib/keyStroke"
import { ConfigCtx, configListenerName } from "@context/configCtx"
import { ConfigEvalMode } from "@lib/control"
import KeyZoneLabel from "./keyZoneLabel"
import { KeyDefinition } from "@lib/keyDefinition"

export default function KeyCell(
  { index, activateKeyGrid, keyboard }: {
    index: KeyIndex
    activateKeyGrid: RefObject<() => void>
    keyboard: KeyboardInstance
  }
) {
  const self = useRef(null as unknown as HTMLDivElement)
  const [gesture, setGesture] = useState(null as TouchGesture|null)
  const [isShift, setIsShift] = useState(false)
  const [isCapsLock, setIsCapsLock] = useState(false)
  const [gestureSegment, setGestureSegment] = useState({} as GestureSegment)
  const [embedGrid, setEmbedGrid] = useState(null as JSX.Element|null)
  const canvas = useContext(PageCanvasCtx)
  const textAreaEdit = useContext(TextAreaEditCtx)
  const keyGridState = useContext(KeyGridCtx)
  const configCtx = useContext(ConfigCtx)
  const [label, setLabel] = useState(
    keyboard?.keyboard.getKey(index.row, index.col)?.label 
    || new KeyLabel()
  )
  const [map, setMap] = useState(
    keyboard?.keyboard.getKey(index.row, index.col)?.map 
    || new KeyMap()
  )
  const onGesture = useRef(undefined as undefined|((g: TouchGesture) => void))
  const onGestureSegment = useRef(undefined as undefined|((gs: GestureSegment) => void))

  const getGestureSegmentLength = () => (
    Math.min(self.current!.clientWidth, self.current!.clientHeight) * 0.4
  )
  
  // define onGesture
  useEffect(
    () => {
      onGesture.current = !(configCtx && keyGridState) ? undefined : (gesture: TouchGesture) => {
        const keys = map.getKeys(gesture, true, true)

        if (keys instanceof KeyStroke) {
          console.info(`keystroke=${keys} for gesture=${gesture}`)
          const target = document.activeElement || document

          // dispatch to eval composer
          const { closedKeyboard } = keys.dispatch(
            target === textAreaEdit.current.target.current ? textAreaEdit.current : undefined, 
            keyGridState
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
                  keyGridState.addKeyGrid(
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
    },
    [ configCtx, keyGridState, textAreaEdit, activateKeyGrid, index, embedGrid, map ]
  )

  // define onGestureSegment
  useEffect(
    () => {
      onGestureSegment.current = label.pseudoZoneGestureSegmentDefined ? setGestureSegment : undefined
    },
    [ label ]
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
        space.add(() => {
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
    [ canvas, gesture ]
  )

  // listen to modifier keys
  useEffect(
    () => {
      if (!keyGridState) return

      const mkeyListeners: [Set<ModifierKeyListener>, Dispatch<SetStateAction<boolean>>][] = []

      if (label.pseudoZoneShiftDefined || label.pseudoZoneCapsLockDefined) {
        keyGridState.shiftListeners.add(setIsShift)
        mkeyListeners.push([keyGridState.shiftListeners, setIsShift])

        keyGridState.capsLockListeners.add(setIsCapsLock)
        mkeyListeners.push([keyGridState.capsLockListeners, setIsCapsLock])
      }

      return () => { 
        mkeyListeners.forEach(([ls, l]) => ls.delete(l))
      }
    },
    [ keyGridState, label ]
  )

  // listen to mouse and touch events
  useEffect(
    () => {
      if (!onGesture.current) {
        return
      }

      const _self = self.current

      const start = (e: TouchEvent|MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setGesture(TouchGesture.create(
          e, 
          getGestureSegmentLength(),
          map,
          onGesture.current, 
          onGestureSegment.current
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
        if (gesture && !gesture.complete && keyGridState) {
          keyGridState.mouseHoverKeyCell.current = _self
        }
      }
      const unsetMouseHover = () => {
        if (keyGridState?.mouseHoverKeyCell.current === _self) {
          keyGridState.mouseHoverKeyCell.current = null
        }
      }

      if (isTouchScreen()) {
        _self?.addEventListener('touchstart', start)
        _self?.addEventListener('touchmove', move)
        _self?.addEventListener('touchend', end)
      }
      else {
        _self?.addEventListener('mousedown', start)
        _self?.addEventListener('mousemove', move)
        _self?.addEventListener('mouseup', end)
        _self?.addEventListener('mouseup', unsetMouseHover)
        _self?.addEventListener('mouseleave', setMouseHover)
        _self?.addEventListener('mouseenter', unsetMouseHover)
      }

      return () => {
        if (isTouchScreen()) {
          _self?.removeEventListener('touchstart', start)
          _self?.removeEventListener('touchmove', move)
          _self?.removeEventListener('touchend', end)
        }
        else {
          _self?.removeEventListener('mousedown', start)
          _self?.removeEventListener('mousemove', move)
          _self?.removeEventListener('mouseup', end)
          _self?.removeEventListener('mouseup', unsetMouseHover)
          _self?.removeEventListener('mouseleave', setMouseHover)
          _self?.removeEventListener('mouseenter', unsetMouseHover)
        }
      }
    },
    [ keyGridState, gesture, map ]
  )

  // read key config updates
  useEffect(
    () => {
      if (!configCtx) {
        return 
      }

      const name = configListenerName(KeyCell.name + `[${index.col},${index.row}]`)
      configCtx.addSaveListener(name, KeyDefinition.name, () => {
        if (
          configCtx.keyboardInstance
          && configCtx.keyIndex?.col === index.col && configCtx.keyIndex.row === index.row
        ) {
          const newLabel = configCtx.keyboardInstance.keyboard.getKey(index.row, index.col)?.label || new KeyLabel()
          if (!label.equals(newLabel)) {
            setLabel(newLabel)
          }
          
          const newMap = configCtx.keyboardInstance.keyboard.getKey(index.row, index.col)?.map || new KeyMap()
          if (!map.equals(newMap)) {
            setMap(newMap)
          }
        }
      })

      return () => configCtx.deleteSaveListener(name, KeyDefinition.name)
    },
    [ configCtx, index, label, map ]
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
              <KeyZoneLabel 
                key={zone} zone={zone} label={label} 
                isShift={isShift} isCapsLock={isCapsLock} 
                gestureSegment={gestureSegment} />
            )
          )}
        </div>

        {/* embed grid */}
        { embedGrid ? embedGrid : undefined }
      </div>
    </div>
  )
}