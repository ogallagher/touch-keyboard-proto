import IncDec from "@component/incDec"
import { ConfigCtx } from "@context/configCtx"
import { listenerName } from "@lib/eventSync"
import { KeyGridCtx } from "@context/keyGridCtx"
import { Orientation } from "@lib/orientation"
import { useContext, useEffect, useRef, useState } from "react"
import { BoxArrowInUp, BoxArrowUp, FileEarmarkArrowDown, Grid3x3, ListUl, PlusCircle, Share } from "react-bootstrap-icons"
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
  const [showExport, setShowExport] = useState(false)

  // listen to session keyboards list
  useEffect(
    () => {
      if (!keyGridState) return

      const name = listenerName(ConfigKeyGrid.name)
      keyGridState.keyboardsListListeners.set(name, () => setKeyboardInstanceIds([...keyGridState.keyboardIds]))

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
      {/* session keyboards */}
      <div className='flex flex-row flex-wrap justify-between gap-1'>
        <div>session keyboards</div>

        {/* toggle show list */}
        <button
          className='cursor-pointer'
          title='Toggle display list'
          onClick={() => setShowKeyboardsList(!showKeyboardsList)} >
          <ListUl />
        </button>

        {/* toggle show export */}
        <button
          className='cursor-pointer'
          title='Export keyboards'
          onClick={() => setShowExport(!showExport)} >
          <BoxArrowUp />
        </button>

        {/* import from file */}
        <button
          className='cursor-pointer'
          title='Import keyboards from file'
          onClick={() => console.log('// TODO import keyboards')} >
          <BoxArrowInUp />
        </button>
      </div>

      {/* session keyboards list */}
      <div 
        title='Session keyboards list'
        className={[
          showKeyboardsList ? '' : 'hidden',
          'border-b-2 border-t-2 my-1'
        ].join(' ')} >
        {keyboardInstanceIds.map(keyboardInstanceId => (
          <SessionKeyboardListItem 
            key={keyboardInstanceId}
            keyboardInstanceId={keyboardInstanceId} />
        ))}
        {/* add keyboard */}
        <div className='flex flex-row justify-center pb-1'>
          <button
            className='cursor-pointer'
            title='Add new empty keyboard'
            onClick={addKeyboard.current} >
            <PlusCircle />
          </button>
        </div>
      </div>

      <div 
        className={[
          'flex-row justify-between gap-1 border-b-2 pb-2',
          (showExport ? 'flex' : 'hidden')
        ].join(' ')}
        title='Export options' >
        {/* export file */}
        <button
          className='cursor-pointer'
          title='Download file'
          onClick={() => console.log('// TODO download file')} >
          <FileEarmarkArrowDown />
        </button>

        {/* share url */}
        <button
          className='cursor-pointer'
          title='Share link'
          onClick={() => console.log('// TODO share link')} >
          <Share />
        </button>
      </div>

      {/* grid dimensions */}
      <div 
        className='flex flex-row justify-center gap-2 text-2xl'
        title='Keyboard grid dimensions' >
        <div className='flex flex-col justify-center pr-2'>
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