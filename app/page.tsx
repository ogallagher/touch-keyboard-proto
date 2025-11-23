'use client'

import Header from "@component/header"
import GridDimensions from "@lib/gridDimensions"
import { useRef, useState } from "react"
import { PageCanvasCtx } from "@context/pageCanvasCtx"
import { EditTextArea, TextAreaEditCtx } from "@context/textAreaCtx"
import ConfigEvalSection from "@component/configEvalSection"
import KeyGridSection from "@component/keyGridSection"

export default function Home() {
  const [gridDimensions, setGridDimensions] = useState(new GridDimensions(1, 1))
  const canvas = useRef(null as unknown as HTMLCanvasElement)
  const textAreaEdit = useRef(null as unknown as EditTextArea)
  
  return (
    <div 
      className={[
        "flex flex-col justify-start gap-2",
        'h-dvh'
      ].join(' ')}>
      {/* overlay graphics canvas */}
      <canvas
        ref={canvas}
        className="fixed w-full h-full pointer-events-none touch-none z-10" />

      {/* header */}
      <Header />

      <ConfigEvalSection
        gridDimensions={gridDimensions} setGridDimensions={setGridDimensions}
        textAreaEdit={textAreaEdit} />

      <PageCanvasCtx value={canvas}>
        <TextAreaEditCtx value={textAreaEdit}>
          <KeyGridSection setGridDimensions={setGridDimensions} />
        </TextAreaEditCtx>
      </PageCanvasCtx>
    </div>
  )
}
