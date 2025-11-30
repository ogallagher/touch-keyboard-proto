import { PageCanvasCtx } from "@context/pageCanvasCtx"
import { ConfigSection } from "@lib/control"
import { listenerName } from "@lib/eventSync"
import { useContext, useEffect, useState } from "react"
import { Claude } from "react-bootstrap-icons"

export default function ConfigSite(
  { configSection }: {
    configSection: ConfigSection
  }
) {
  const canvasCtx = useContext(PageCanvasCtx)
  const [showGesturesCanvas, setShowGesturesCanvas] = useState(canvasCtx.showGesturesCanvas)
    
  // read from canvas ctx
  useEffect(
    () => {
      const name = listenerName(ConfigSite.name)
      canvasCtx.showGesturesListeners.set(name, () => {
        setShowGesturesCanvas(canvasCtx.showGesturesCanvas)
      })
    },
    [ canvasCtx ]
  )

  return (
    <div 
      className={[
        'flex-col justify-evenly gap-2 pb-4 text-lg',
        (configSection === 'grid' ? 'flex': 'hidden')
      ].join(' ')} >
      {/* toggle show gesture canvas */}
      <div className='flex flex-row justify-center pb-1'>
        <button
          className={[
            'cursor-pointer',
            (showGesturesCanvas ? '' : 'opacity-50')
          ].join(' ')}
          title='Toggle show gesture overlay'
          onClick={() => {
            // write to canvas ctx
            canvasCtx.setShowGesturesCanvas(!showGesturesCanvas)
          }} >
          <Claude />
        </button>
      </div>
    </div>
  )
}