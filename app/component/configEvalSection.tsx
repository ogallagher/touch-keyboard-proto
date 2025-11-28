import { Gear, Play, Trash } from "react-bootstrap-icons"
import ComposerTextArea from "@component/textArea"
import { useContext, useEffect, useState } from "react"
import { TextAreaEditCtx } from "@context/textAreaCtx"
import { ConfigEvalMode } from "@lib/control"
import { ConfigCtx } from "@context/configCtx"
import ConfigKeyCell from "./config/configKeyCell"
import ConfigKeyGrid from "./config/configKeyGrid"

export default function ConfigEvalSection() {
  const configCtx = useContext(ConfigCtx)
  const textAreaEdit = useContext(TextAreaEditCtx)
  const [mode, setMode] = useState(configCtx?.mode || ConfigEvalMode.Eval)

  // write to config context
  useEffect(
    () => {
      if (!configCtx) return
      
      configCtx.setMode(mode)
    },
    [ configCtx, mode ]
  )

  return (
    <div className="relative pointer-none">
      {/* eval mode */}
      <section
        className={[
          'flex-row justify-center gap-2',
          mode === ConfigEvalMode.Eval ? 'flex' : 'hidden' 
        ].join(' ')} >
        <ComposerTextArea visible={mode === ConfigEvalMode.Eval} />

        <button
          className="cursor-pointer"
          onClick={() => {
            textAreaEdit.reset()
          }}
          title='clear composer text area' >
          <Trash />
        </button>
      </section>

      {/* config mode */}
      <section
        className={[
          'flex flex-row justify-evenly gap-4 flex-wrap px-2',
          mode === ConfigEvalMode.Config ? 'flex' : 'hidden'
        ].join(' ')} >
        
        <ConfigKeyCell />

        <ConfigKeyGrid />
      </section>

      {/* switch between modes */}
      <button 
        className="absolute bottom-0 right-0 px-1 cursor-pointer" 
        onClick={() => {
          if (mode === ConfigEvalMode.Eval) {
            setMode(ConfigEvalMode.Config)
          }
          else {
            setMode(ConfigEvalMode.Eval)
          }
        }} >
        {mode === ConfigEvalMode.Eval ? <Gear /> : <Play />}
      </button>
    </div>
  )
}