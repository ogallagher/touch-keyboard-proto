import { Gear, Play, Trash } from "react-bootstrap-icons"
import TextArea from "@component/textArea"
import IncDec from "./incDec"
import GridDimensions from "@lib/gridDimensions"
import { Dispatch, RefObject, SetStateAction, useContext, useEffect, useState } from "react"
import { EditTextArea } from "@context/textAreaCtx"
import { Orientation } from "@lib/orientation"
import { ConfigEvalMode } from "@lib/control"
import { ConfigCtx } from "@context/configCtx"
import { KeyDefinition } from "@lib/keyboardDefinition"
import TouchGesture from "@lib/touchGesture"
import KeyLabel from "@lib/keyLabel"
import KeyMap from "@lib/keyMap"
import KeyStroke from "@lib/keyStroke"

export default function ConfigEvalSection(
  { gridDimensions, setGridDimensions, textAreaEdit }: {
    gridDimensions: GridDimensions,
    setGridDimensions: Dispatch<SetStateAction<GridDimensions>>
    textAreaEdit: RefObject<EditTextArea>
  }
) {
  const configCtx = useContext(ConfigCtx)
  const [mode, setMode] = useState(configCtx.mode)
  const [keyboardName, setKeyboardName] = useState(configCtx.keyboardInstance?.keyboard.name)
  const [keyLabel, setKeyLabel] = useState(undefined as KeyLabel|undefined)
  const [keyMap, setKeyMap] = useState(undefined as KeyMap|undefined)
  const [keyStroke, setKeyStroke] = useState(undefined as KeyStroke|undefined)
  const [gesture, setGesture] = useState(undefined as TouchGesture|undefined)

  // init on new config context
  useEffect(
    () => {
      configCtx.addLoadListener('ConfigEvalSection', () => {
        setKeyboardName(configCtx.keyboardInstance?.keyboard.name)

        let key: KeyDefinition|undefined
        if (configCtx.keyboardInstance && configCtx.keyIndex) {
          key = configCtx.keyboardInstance.keyboard.getKey(configCtx.keyIndex.row, configCtx.keyIndex.col)
        }

        setKeyLabel(key?.label)
        setKeyMap(key?.map)
        setKeyStroke(configCtx.keystroke)
        setGesture(configCtx.gesture)
      })
    },
    []
  )

  // write to config context
  useEffect(
    () => {
      configCtx.mode = mode
    },
    [ mode ]
  )
  useEffect(
    () => {
      if (configCtx.keyboardInstance && keyboardName) {
        configCtx.keyboardInstance.keyboard.name = keyboardName
      }
    },
    [ keyboardName ]
  )

  return (
    <div className="relative pointer-none">
      {/* eval mode */}
      <section
        className={[
          'flex-row justify-evenly',
          mode === ConfigEvalMode.Eval ? 'flex' : 'hidden' 
        ].join(' ')} >
        <TextArea edit={textAreaEdit} visible={mode === ConfigEvalMode.Eval} />

        <button
          className="cursor-pointer"
          onClick={() => {
            textAreaEdit.current.reset()
          }}
          title='clear composer text area' >
          <Trash />
        </button>
      </section>

      {/* config mode */}
      <section
        className={[
          'flex flex-row justify-evenly',
          mode === ConfigEvalMode.Config ? 'flex' : 'hidden'
        ].join(' ')} >
        
        
        {/* key cell */}
        <div
          className='flex flex-col justify-between gap-1' >
          {/* key label */}
          <div
            className='flex flex-row justify-start' >
            {'L: ' + keyLabel?.getZone('center')}
          </div>
          {/* key map */}
          <div
            className='flex flex-row justify-start' >
            {'g: ' + gesture?.toString()}
          </div>
          <div
            className='flex flex-row justify-start' >
            {'s: ' + keyStroke?.toString()}
          </div>
        </div>

        {/* keyboard, grid */}
        <div
          className='flex flex-col justify-evenly gap-1' >
          {/* grid dimensions */}
          <div
            className='flex flex-row text-2xl'>
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
          <div
            className='flex flex-row justify-between gap-1' >
            {/* name */}
            name: 
            <input
              type='text'
              value={keyboardName || 'no keyboard loaded'} 
              onChange={(e) => setKeyboardName(e.target.value)} />
          </div>
        </div>
      </section>

      {/* switch between modes */}
      <button 
        className="absolute bottom-0 right-0 p-4 cursor-pointer" 
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