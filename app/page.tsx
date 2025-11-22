'use client'

import Header from "@component/header"
import KeyGrid from "@component/keyGrid"
import GridDimensions from "@lib/gridDimensions"
import IncDec from "@component/incDec"
import { Orientation } from "@lib/orientation"
import { useEffect, useRef, useState } from "react"
import { PageCanvasCtx } from "@context/pageCanvasCtx"
import { frthenKeyboard } from "@lib/keyboardDefinitions/eng_frthen"
import TextArea from "@component/textArea"
import { EditTextArea, TextAreaEditCtx } from "@context/textAreaCtx"

export default function Home() {
  const [gridDimensions, setGridDimensions] = useState(new GridDimensions(
    frthenKeyboard.keys[0].length, 
    frthenKeyboard.keys.length
  ))
  const canvas = useRef(null as unknown as HTMLCanvasElement)
  // const [windowInnerHeight, setWindowInnerHeight] = useState(null as unknown as number)
  const textAreaEdit = useRef(null as unknown as EditTextArea)

  // useEffect(
  //   () => {
  //     const onResize = () => setWindowInnerHeight(window.innerHeight)
  //     window.addEventListener('resize', onResize)

  //     onResize()

  //     return () => window.removeEventListener('resize', onResize)
  //   },
  //   []
  // )
  
  return (
    <div 
      className={[
        "flex flex-col justify-start gap-2",
        'h-dvh'
        // `h-[${windowInnerHeight}px]`
      ].join(' ')}>
      {/* overlay graphics canvas */}
      <canvas
        ref={canvas}
        className="fixed w-full h-full pointer-events-none touch-none" />

      {/* header */}
      <Header />

      {/* eval */}
      <section
        className="flex flex-row justify-evenly" >
        <TextArea edit={textAreaEdit} />
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
        <TextAreaEditCtx value={textAreaEdit}>
          <KeyGrid dimensions={gridDimensions} keyboard={frthenKeyboard} />
        </TextAreaEditCtx>
      </PageCanvasCtx>
    </div>
  )
}
