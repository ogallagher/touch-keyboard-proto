import { PageCanvasCtx } from "@context/pageCanvasCtx"
import { listenerName } from "@lib/eventSync"
import { useContext, useEffect, useRef, useState } from "react"

export default function PageGraphicsCanvas() {
  const canvasCtx = useContext(PageCanvasCtx)
  const canvas = useRef(null as unknown as HTMLCanvasElement)
  const [showGesturesCanvas, setShowGesturesCanvas] = useState(true)
  
  // sync canvas ctx
  useEffect(
    () => {
      canvasCtx.setCanvas(canvas.current)

      const name = listenerName(PageGraphicsCanvas.name)
      canvasCtx.showGesturesListeners.set(name, () => {
        setShowGesturesCanvas(canvasCtx.showGesturesCanvas)
      })

      return () => { 
        canvasCtx.showGesturesListeners.delete(name)
      }
    },
    [ canvasCtx ]
  )

  return (
    <canvas
      ref={canvas}
      className={[
        'h-full pointer-events-none touch-none z-20',
        (showGesturesCanvas ? 'fixed' : 'hidden')
      ].join(' ')} />
  )
}