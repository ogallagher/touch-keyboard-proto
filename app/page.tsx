'use client'

import Header from "@component/header"
import { Suspense} from "react"
import { PageCanvasCtx, PageCanvasState } from "@context/pageCanvasCtx"
import { EditTextArea, TextAreaEditCtx } from "@context/textAreaCtx"
import ConfigEvalSection from "@component/configEvalSection"
import KeyGridSection from "@component/keyGridSection"
import { ConfigCtx, ConfigureKeyBoard } from "@context/configCtx"
import { KeyGridCtx, KeyGridState } from "@context/keyGridCtx"
import PageGraphicsCanvas from "@component/canvas"

const config = new ConfigureKeyBoard()
const keyGridState = new KeyGridState()
const textAreaEdit = new EditTextArea()
const canvasState = new PageCanvasState()

export default function Home() {
  return (
    <div 
      className={[
        'flex flex-col justify-start gap-2',
        'h-dvh'
      ].join(' ')}>
      <PageCanvasCtx value={canvasState}>
        {/* overlay graphics canvas */}
        <PageGraphicsCanvas />

        {/* header */}
        <Header />

        <div
          className='flex flex-col justify-between gap-2 grow'>
          <KeyGridCtx value={keyGridState}>
            <ConfigCtx value={config} >
              <TextAreaEditCtx value={textAreaEdit}>
                
                  <ConfigEvalSection />

                  <Suspense fallback={<div className='relative h-[25dvh]'></div>}>
                    <KeyGridSection />
                  </Suspense>
              </TextAreaEditCtx>
            </ConfigCtx>
          </KeyGridCtx>
        </div>
      </PageCanvasCtx>
    </div>
  )
}
