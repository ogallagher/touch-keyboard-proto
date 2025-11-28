import IncDec from "@component/incDec"
import { ConfigCtx } from "@context/configCtx"
import { listenerName } from "@lib/eventSync"
import { KeyGridCtx } from "@context/keyGridCtx"
import { Orientation } from "@lib/orientation"
import { useContext, useEffect, useRef, useState } from "react"
import { Grid3x3, ListUl, PlusCircle } from "react-bootstrap-icons"
import SessionKeyboardListItem from "./sessionKeyboardListItem"
import KeyboardDefinition, { KeyboardInstance, KeyboardPersistance, KeyboardSize } from "@lib/keyboardDefinition"
import { KeyDefinition } from "@lib/keyDefinition"
import KeyLabel from "@lib/keyLabel"
import KeyMap from "@lib/keyMap"

export default function ConfigKeyGrid() {
  const keyGridState = useContext(KeyGridCtx)
  const configCtx = useContext(ConfigCtx)
  const [keyboardInstanceIds, setKeyboardInstanceIds] = useState([] as string[])
  const [gridDimensions, setGridDimensions] = useState(configCtx?.keyboardInstance?.keyboard.dimensions)
  const [keyboardName, setKeyboardName] = useState(configCtx?.keyboardInstance?.keyboard.name)
  const addKeyboard = useRef(null as unknown as () => void)
  const [showKeyboardsList, setShowKeyboardsList] = useState(false)

  // listen to session keyboards list
  useEffect(
    () => {
      if (!keyGridState) return

      const name = listenerName(ConfigKeyGrid.name)
      keyGridState.keyboardsListListeners.set(name, () => {
        setKeyboardInstanceIds(
          // derive ids from map values instead of keys to remain independent of gridCtx implementation
          [...keyGridState.keyboards.values()]
          .map(ki => ki.instanceId)
        )
      })

      return () => { keyGridState.keyboardsListListeners.delete(name) }
    },
    [ keyGridState ]
  )

  // init on new config context
  useEffect(
    () => {
      if (!configCtx) return

      const name = listenerName(ConfigKeyGrid.name)
      configCtx.addLoadListener(name, () => {
        setGridDimensions(configCtx.keyboardInstance?.keyboard.dimensions)
        setKeyboardName(configCtx.keyboardInstance?.keyboard.name)
      })

      return () => configCtx.deleteLoadListener(name)
    },
    [ configCtx ]
  )

  // write name to config context
  useEffect(
    () => {
      if (!configCtx || !keyboardName) return

      configCtx.setKeyboardName(keyboardName)
    },
    [ configCtx, keyboardName ]
  )
  // write dimensions to config context
  useEffect(
    () => {
      if (!configCtx) return

      if (configCtx.keyboardInstance && gridDimensions) {
        configCtx.setGridDimensions(gridDimensions)
      }
    },
    [ configCtx, gridDimensions ]
  )

  // define addKeyboard
  useEffect(
    () => {
      if (!keyGridState) return

      const randomDigits = (len: number) => {
        const digits = new Array(len)
        for (let i=0; i<len; i++) {
          digits[i] = Math.round(Math.random() * 9)
        }
        return digits.join('')
      }
      addKeyboard.current = () => {
        keyGridState.addKeyGrid(
          new KeyboardInstance(
            new KeyboardDefinition(
              `new-keyb-${randomDigits(3)}`,
              [[ new KeyDefinition({
                label: new KeyLabel(),
                map: new KeyMap()
              }) ]]
            ),
            { 
              // TODO not sure why this is count is inaccurate
              index: keyboardInstanceIds.length,
              persistance: KeyboardPersistance.Indefinite,
              size: KeyboardSize.Fill
            }
          ),
          true
        )
      }
    },
    [ keyGridState, keyboardInstanceIds ]
  )
  
  return (
    <div
      className='flex flex-col justify-evenly gap-1 pb-4' >
      {/* session keyboards list */}
      <div className='flex flex-row justify-between gap-1'>
        <div>session keyboards</div>
        <button
          className='cursor-pointer'
          title='Toggle display list'
          onClick={() => setShowKeyboardsList(!showKeyboardsList)} >
          <ListUl />
        </button>
      </div>
      <div 
        title='Session keyboards list'
        className={showKeyboardsList ? '' : 'hidden'} >
        {keyboardInstanceIds.map(keyboardInstanceId => (
          <SessionKeyboardListItem 
            key={keyboardInstanceId}
            keyboardInstanceId={keyboardInstanceId} />
        ))}
        {/* add keyboard */}
        <button
          className='cursor-pointer'
          title='Add new empty keyboard'
          onClick={addKeyboard.current} >
          <PlusCircle />
        </button>
      </div>

      {/* grid dimensions */}
      <div 
        className='flex flex-row justify-center gap-2 text-2xl'
        title='Keyboard grid dimensions' >
        <div className='flex flex-col justify-center'>
          <Grid3x3 className='text-4xl' />
        </div>

        {/* config grid dimensions.width */}
        <IncDec
          orientation={Orientation.Horizontal} 
          onDec={() => setGridDimensions(gridDimensions?.colAdd(-1))}
          onInc={() => setGridDimensions(gridDimensions?.colAdd(+1))} />
        {/* config grid dimensions.height */}
        <IncDec 
          orientation={Orientation.Vertical}
          onDec={() => setGridDimensions(gridDimensions?.rowAdd(-1))}
          onInc={() => setGridDimensions(gridDimensions?.rowAdd(+1))} />
      </div>

      {/* name */}
      <div
        className='flex flex-row justify-center gap-2 px-2' >
        <div className='flex flex-col justify-center'>
          name: 
        </div>
        <input
          className='field-sizing-content min-w-8 text-base font-mono dark:bg-zinc-700 bg-zinc-300 rounded-md p-1'
          type='text'
          placeholder='keyboard name'
          value={keyboardName || ''} 
          onChange={e => setKeyboardName(e.target.value)} />
      </div>
    </div>
  )
}