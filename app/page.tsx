'use client'

import { websiteBasePath } from "@lib/path"
import Header from "@component/header"
import KeyGrid from "@component/keyGrid"
import GridDimensions from "@lib/gridDimensions"
import IncDec from "@component/incDec"
import { Orientation } from "@lib/orientation"
import { useEffect, useRef, useState } from "react"
import { PageCanvasCtx } from "@context/pageCanvasCtx"
import { frthenKeyboard } from "@lib/keyboardDefinitions/eng_frthen"

export default function Home() {
  const [gridDimensions, setGridDimensions] = useState(new GridDimensions(
    frthenKeyboard.keys[0].length, 
    frthenKeyboard.keys.length
  ))
  const canvas = useRef(null as unknown as HTMLCanvasElement)
  const textArea = useRef(null as unknown as HTMLTextAreaElement)

  useEffect(
    () => {
      textArea.current.focus()
    }
  )
  
  return (
    <div 
      className="min-h-screen flex flex-col justify-start gap-2">
      {/* overlay graphics canvas */}
      <canvas
        ref={canvas}
        className="fixed z-10 w-full h-full pointer-events-none" />

      {/* header */}
      <Header />

      {/* eval */}
      <section
        className="flex flex-row justify-evenly" >
        <textarea
          ref={textArea}
          className="resize font-mono"
          placeholder="free form text area" ></textarea>
      </section>

      {/* config */}
      <div
        className="flex flex-row justify-evenly gap-1 text-2xl">
        {/* config grid dimensions.width */}
        <IncDec
          orientation={Orientation.Horizontal} 
          onDec={() => setGridDimensions(gridDimensions.colAdd(-1))}
          onInc={() => setGridDimensions(gridDimensions.colAdd(+1))} />
        {/* config grid dimensions.height */}
        <IncDec 
          orientation={Orientation.Vertical}
          onDec={() => setGridDimensions(gridDimensions.rowAdd(-1))}
          onInc={() => setGridDimensions(gridDimensions.rowAdd(+1))} />
      </div>

      <PageCanvasCtx value={canvas}>
        <KeyGrid dimensions={gridDimensions} keyboard={frthenKeyboard} />
      </PageCanvasCtx>
    </div>
  )
}
