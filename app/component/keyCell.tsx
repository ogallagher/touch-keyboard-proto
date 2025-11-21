import KeyLabel from "@lib/keyLabel"
import TouchGesture from "@lib/touchGesture"
import pino from "pino"
import { MouseEvent, RefObject, TouchEvent, useRef, useContext, useEffect, useState } from "react"
import { PageCanvasCtx } from "@context/pageCanvasCtx"
import { CanvasForm, CanvasSpace, Circle } from "pts"

const logger = pino({
  name: 'key-cell'
})

export default function KeyCell(
  { label }: {
    label: KeyLabel
  }
) {
  const self = useRef(null as HTMLDivElement|null)
  const [gesture, setGesture] = useState(null as TouchGesture|null)
  const canvas = useContext(PageCanvasCtx)

  const getGestureSegmentLength = () => (
    Math.min(self.current!.clientWidth, self.current!.clientHeight) * 0.4
  )

  // draw gesture
  useEffect(() => {
    if (canvas.current && gesture) {
      logger.info('use canvas')
      const space = new CanvasSpace(canvas.current)
      space.background = 'transparent'
      const form = space.getForm()

      // animation
      space.add((_time, _ftime) => {
        space.clear('transparent')

        if (gesture.points.length > 1) {
          form
          .strokeOnly('#fff1', getGestureSegmentLength() * 0.05, 'round', 'round')
          .line(gesture.points)
        }

        for (let p of gesture.points) {
          form
          .fillOnly('#09f1')
          .circle(Circle.fromCenter(
            p,
            getGestureSegmentLength() * 0.1
          ))
        }

        if (gesture.complete) {
          space.stop()
        }
      })

      space.play()
    }
  }, [gesture])

  const onGesture = () => {
    logger.info(`keystroke for gesture=${gesture}`)
  }

  return (
    <div
      ref={self}
      className={[
        'dark:bg-zinc-900 dark:hover:bg-zinc-800 bg-zinc-100 hover:bg-zinc-200',
        'select-none',
        'grow',
        'flex flex-col justify-center text-center',
        'rounded-lg'
      ].join(' ')}
      onTouchStart={(e) => {
        setGesture(TouchGesture.create(e, getGestureSegmentLength(), onGesture))
      }}
      onMouseDown={(e) => {
        setGesture(TouchGesture.create(e, getGestureSegmentLength(), onGesture))
      }}
      onTouchMove={(e) => {
        if (gesture && !gesture.complete) {
          gesture.update(e)
        }
      }}
      onMouseMove={(e) => {
        if (gesture && !gesture.complete) {
          gesture.update(e)         
        }
      }}
      onTouchEnd={(e) => {
        gesture?.update(e)
      }}
      onMouseUp={(e) => {
        gesture?.update(e)
      }}
      onTouchCancel={() => {
        setGesture(null)
      }} >
      <span>{label.center}</span>
    </div>
  )
}