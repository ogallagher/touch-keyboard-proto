import KeyLabel from "@lib/keyLabel"
import TouchGesture from "@lib/touchGesture"
import pino from "pino"
import { MouseEvent, RefObject, TouchEvent, useRef } from "react"

const logger = pino({
  name: 'key-cell'
})

export default function KeyCell(
  { label }: {
    label: KeyLabel
  }
) {
  const gesture: RefObject<TouchGesture|null> = useRef(null)

  const getGestureSegmentLength = (e: TouchEvent|MouseEvent) => {
    let self = e.target as HTMLElement
    return Math.min(self.clientWidth, self.clientHeight) * 0.4
  }

  const onGesture = () => {
    logger.info(`keystroke for gesture=${gesture.current}`)
  }

  return (
    <div
      className={[
        'dark:bg-zinc-900 dark:hover:bg-zinc-800 bg-zinc-100 hover:bg-zinc-200',
        'select-none',
        'grow',
        'flex flex-col justify-center text-center',
        'rounded-lg'
      ].join(' ')}
      onTouchStart={(e) => {
        gesture.current = TouchGesture.create(e, getGestureSegmentLength(e), onGesture)
      }}
      onMouseDown={(e) => {
        gesture.current = TouchGesture.create(e, getGestureSegmentLength(e), onGesture)
      }}
      onTouchMove={(e) => {
        if (gesture.current && !gesture.current.complete) {
          gesture.current?.update(e)
        }
      }}
      onMouseMove={(e) => {
        if (gesture.current && !gesture.current.complete) {
          gesture.current.update(e)         
        }
      }}
      onTouchEnd={(e) => {
        gesture.current?.update(e)
      }}
      onMouseUp={(e) => {
        gesture.current?.update(e)
      }}
      onTouchCancel={() => {
        gesture.current = null
      }} >
      <span>{label.center}</span>
    </div>
  )
}