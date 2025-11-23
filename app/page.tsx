'use client'

import Header from "@component/header"
import KeyGrid from "@component/keyGrid"
import GridDimensions from "@lib/gridDimensions"
import { useRef, useState } from "react"
import { PageCanvasCtx } from "@context/pageCanvasCtx"
import { frthenKeyboard } from "@lib/keyboardDefinitions/eng_frthen"
import { EditTextArea, TextAreaEditCtx } from "@context/textAreaCtx"
import { KeyGridCtx, KeyGridState } from "@context/keyGridCtx"
import ConfigEvalSection from "@component/configEvalSection"

export default function Home() {
  const [gridDimensions, setGridDimensions] = useState(new GridDimensions(
    frthenKeyboard.keys[0].length, 
    frthenKeyboard.keys.length
  ))
  const canvas = useRef(null as unknown as HTMLCanvasElement)
  const textAreaEdit = useRef(null as unknown as EditTextArea)
  const keyGridState = useRef(new KeyGridState())
  
  return (
    <div 
      className={[
        "flex flex-col justify-start gap-2",
        'h-dvh'
      ].join(' ')}>
      {/* overlay graphics canvas */}
      <canvas
        ref={canvas}
        className="fixed w-full h-full pointer-events-none touch-none" />

      {/* header */}
      <Header />

      <ConfigEvalSection
        gridDimensions={gridDimensions} setGridDimensions={setGridDimensions}
        textAreaEdit={textAreaEdit} />

      <PageCanvasCtx value={canvas}>
        <TextAreaEditCtx value={textAreaEdit}>
          <KeyGridCtx value={keyGridState}>
            <KeyGrid dimensions={gridDimensions} keyboard={frthenKeyboard} />
          </KeyGridCtx>
        </TextAreaEditCtx>
      </PageCanvasCtx>
    </div>
  )
}
