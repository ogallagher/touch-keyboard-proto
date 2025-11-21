'use client'

import Image from "next/image"
import { websiteBasePath } from "@lib/path"
import Header from "@component/header"
import KeyGrid from "@component/keyGrid"
import GridDimensions from "@lib/gridDimensions"
import IncDec from "@component/incDec"
import { Orientation } from "@lib/orientation"
import { useRef, useState } from "react"
import { PageCanvasCtx } from "@context/pageCanvasCtx"

export default function Home() {
  const [gridDimensions, setGridDimensions] = useState(new GridDimensions(1, 1))
  const canvas = useRef(null as unknown as HTMLCanvasElement)
  
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
        <KeyGrid dimensions={gridDimensions} />
      </PageCanvasCtx>
    </div>
  )
}
