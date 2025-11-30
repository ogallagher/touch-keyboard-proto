import { Gear, GearFill, Grid3x3Gap, Grid3x3GapFill, Play, Square, SquareFill, Trash } from "react-bootstrap-icons"
import ComposerTextArea from "@component/textArea"
import { useContext, useEffect, useState } from "react"
import { TextAreaEditCtx } from "@context/textAreaCtx"
import { ConfigEvalMode, ConfigSection } from "@lib/control"
import { ConfigCtx } from "@context/configCtx"
import ConfigKeyCell from "./config/configKeyCell"
import ConfigKeyGrid from "./config/configKeyGrid"
import ConfigSite from "./config/configSite"

export default function ConfigEvalSection() {
  const configCtx = useContext(ConfigCtx)
  const textAreaEdit = useContext(TextAreaEditCtx)
  const [mode, setMode] = useState(configCtx?.mode || ConfigEvalMode.Eval)
  const [configShowSection, setConfigShowSection] = useState('key' as ConfigSection)

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
      <div 
        className={[
          'flex-row justify-center gap-10 px-2 pb-2',
          mode === ConfigEvalMode.Config ? 'flex' : 'hidden'
        ].join(' ')} >
          {/* select config sub section */}
          <button 
            className='cursor-pointer'
            title='configure keys'
            onClick={() => setConfigShowSection('key')} >
            {configShowSection === 'key' ? <SquareFill /> : <Square />}
          </button>

          <div className='flex flex-row gap-2 cursor-pointer'>
            <button 
              className='cursor-pointer'
              title='configure keyboards'
              onClick={() => setConfigShowSection('grid')} >
                {configShowSection === 'grid' ? <Grid3x3GapFill /> : <Grid3x3Gap />}
            </button>
            <button 
              className='cursor-pointer'
              title='configure interface'
              onClick={() => setConfigShowSection('grid')} >
                {configShowSection === 'grid' ? <GearFill /> : <Gear />}
            </button>
          </div>
      </div>

      <section
        className={[
          'flex-row justify-center gap-10 flex-wrap px-2',
          mode === ConfigEvalMode.Config ? 'flex' : 'hidden'
        ].join(' ')} >
        
        <ConfigKeyCell configSection={configShowSection} />

        <ConfigKeyGrid configSection={configShowSection} />

        <ConfigSite configSection={configShowSection} />
      </section>

      {/* switch between modes */}
      <button 
        className='absolute bottom-0 right-0 px-2 cursor-pointer text-lg' 
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