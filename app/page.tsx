'use client'

import Header from "@component/header"
import { Suspense, useRef } from "react"
import { PageCanvasCtx } from "@context/pageCanvasCtx"
import { EditTextArea, TextAreaEditCtx } from "@context/textAreaCtx"
import ConfigEvalSection from "@component/configEvalSection"
import KeyGridSection from "@component/keyGridSection"
import { ConfigCtx, ConfigureKeyBoard } from "@context/configCtx"
import { KeyGridCtx, KeyGridState } from "@context/keyGridCtx"

const config = new ConfigureKeyBoard()
const keyGridState = new KeyGridState()
const textAreaEdit = new EditTextArea()

export default function Home() {
  const canvas = useRef(null as unknown as HTMLCanvasElement)
  
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

      <KeyGridCtx value={keyGridState}>
        <ConfigCtx value={config} >
          <TextAreaEditCtx value={textAreaEdit}>
            <ConfigEvalSection />

            <PageCanvasCtx value={canvas}>
              <Suspense fallback={<div className='relative grow h-[25dvh]'></div>}>
                <KeyGridSection />
              </Suspense>
            </PageCanvasCtx>
          </TextAreaEditCtx>
        </ConfigCtx>
      </KeyGridCtx>
    </div>
  )
}
