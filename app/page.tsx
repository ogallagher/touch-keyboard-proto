'use client'

import Header from "@component/header"
import { useRef } from "react"
import { PageCanvasCtx } from "@context/pageCanvasCtx"
import { EditTextArea, TextAreaEditCtx } from "@context/textAreaCtx"
import ConfigEvalSection from "@component/configEvalSection"
import KeyGridSection from "@component/keyGridSection"
import { ConfigCtx, ConfigureKeyBoard } from "@context/configCtx"

export default function Home() {
  const canvas = useRef(null as unknown as HTMLCanvasElement)
  const textAreaEdit = useRef(null as unknown as EditTextArea)
  const config = useRef(new ConfigureKeyBoard())
  
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

      <ConfigCtx 
        value={config.current} >
        <ConfigEvalSection
          textAreaEdit={textAreaEdit} />

        <PageCanvasCtx value={canvas}>
          <TextAreaEditCtx value={textAreaEdit}>
            <KeyGridSection />
          </TextAreaEditCtx>
        </PageCanvasCtx>
      </ConfigCtx>
    </div>
  )
}
