import KeyLabel from "@lib/keyLabel"
import TouchGesture from "@lib/touchGesture"
import pino from "pino"
import { useRef, useContext, useEffect, useState, ModifierKey, Dispatch, SetStateAction } from "react"
import { PageCanvasCtx } from "@context/pageCanvasCtx"
import { CanvasSpace, Circle } from "pts"
import KeyMap from "@lib/keyMap"
import { TextAreaEditCtx } from "@context/textAreaCtx"
import { KeyGridCtx, ModifierKeyListener } from "@context/keyGridCtx"

const logger = pino({
  name: 'key-cell'
})

export default function KeyCell(
  { label, map }: {
    label: KeyLabel,
    map: KeyMap
  }
) {
  const self = useRef(null as HTMLDivElement|null)
  const [gesture, setGesture] = useState(null as TouchGesture|null)
  const [isShift, setIsShift] = useState(false)
  const [isCapsLock, setIsCapsLock] = useState(false)
  const canvas = useContext(PageCanvasCtx)
  const textAreaEdit = useContext(TextAreaEditCtx)
  const keyGridState = useContext(KeyGridCtx)

  const getGestureSegmentLength = () => (
    Math.min(self.current!.clientWidth, self.current!.clientHeight) * 0.4
  )

  // draw gesture
  useEffect(
    () => {
      let space: CanvasSpace|undefined
      if (canvas.current && gesture) {
        // logger.info('use canvas')
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

          for (let p of gesture.points) {
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

  function onGesture(gesture: TouchGesture) {
    const keystroke = map.getKeystroke(gesture)

    if (!keystroke) {
      logger.info(`no keystroke for gesture=${gesture}`)
    }
    else {
      logger.info(`keystroke=${keystroke} for gesture=${gesture} points=${gesture.points}`)
      let target = document.activeElement || document

      if (target === textAreaEdit.current.target.current) {
        keystroke.dispatch(textAreaEdit.current, keyGridState.current)
      }
    }
  }

  return (
    <div
      ref={self}
      className={[
        'dark:bg-zinc-900 dark:hover:bg-zinc-800 bg-zinc-100 hover:bg-zinc-200',
        'select-none',
        'grow',
        'flex flex-col justify-evenly',
        'rounded-lg'
      ].join(' ')}
      onTouchStart={(e) => {
        e.preventDefault()
        setGesture(TouchGesture.create(e, getGestureSegmentLength(), onGesture))
      }}
      // TODO handle both touch screen and mouse without duplicate events
      // onMouseDown={(e) => {
      //   e.preventDefault()
      //   setGesture(TouchGesture.create(e, getGestureSegmentLength(), onGesture))
      // }}
      onTouchMove={(e) => {
        if (gesture && !gesture.complete) {
          e.preventDefault()
          gesture.update(e)
        }
      }}
      // onMouseMove={(e) => {
      //   if (gesture && !gesture.complete) {
      //     gesture.update(e)         
      //   }
      // }}
      onTouchEnd={(e) => {
        e.preventDefault()
        gesture?.update(e)
      }}
      // onMouseUp={(e) => {
      //   e.preventDefault()
      //   gesture?.update(e)
      // }}
      onTouchCancel={() => {
        setGesture(null)
      }} >
      <div
        className="flex flex-row justify-evenly">
        <pre>{label.getZone('upleft', label.getPseudo(isShift, isCapsLock))}</pre>
        <pre>{label.getZone('up', label.getPseudo(isShift, isCapsLock))}</pre>
        <pre>{label.getZone('upright', label.getPseudo(isShift, isCapsLock))}</pre>
      </div>
      <div
        className="flex flex-row justify-evenly">
        <pre>{label.getZone('left', label.getPseudo(isShift, isCapsLock))}</pre>
        <pre>{label.getZone('center', label.getPseudo(isShift, isCapsLock))}</pre>
        <pre>{label.getZone('right', label.getPseudo(isShift, isCapsLock))}</pre>
      </div>
      <div
        className="flex flex-row justify-evenly">
        <pre>{label.getZone('downleft', label.getPseudo(isShift, isCapsLock))}</pre>
        <pre>{label.getZone('down', label.getPseudo(isShift, isCapsLock))}</pre>
        <pre>{label.getZone('downright', label.getPseudo(isShift, isCapsLock))}</pre>
      </div>
    </div>
  )
}