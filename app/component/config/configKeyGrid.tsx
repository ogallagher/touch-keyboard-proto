import IncDec from "@component/incDec"
import { ConfigCtx, configListenerName } from "@context/configCtx"
import { Orientation } from "@lib/orientation"
import { useContext, useEffect, useState } from "react"
import { Grid3x3 } from "react-bootstrap-icons"

export default function ConfigKeyGrid() {
  const configCtx = useContext(ConfigCtx)
  const [gridDimensions, setGridDimensions] = useState(configCtx?.keyboardInstance?.keyboard.dimensions)
  const [keyboardName, setKeyboardName] = useState(configCtx?.keyboardInstance?.keyboard.name)

  // init on new config context
  useEffect(
    () => {
      if (!configCtx) return

      const name = configListenerName(ConfigKeyGrid.name)
      configCtx.addLoadListener(name, () => {
        setGridDimensions(configCtx.keyboardInstance?.keyboard.dimensions)
        setKeyboardName(configCtx.keyboardInstance?.keyboard.name)
      })

      return () => configCtx.deleteLoadListener(name)
    },
    [ configCtx ]
  )

  // write to config context
  useEffect(
    () => {
      if (!configCtx) return

      if (configCtx.keyboardInstance && keyboardName) {
        configCtx.keyboardInstance.keyboard.name = keyboardName
      }
    },
    [ configCtx, keyboardName ]
  )

  useEffect(
    () => {
      if (!configCtx) return

      if (configCtx.keyboardInstance && gridDimensions) {
        configCtx.setGridDimensions(gridDimensions)
      }
    },
    [ configCtx, gridDimensions ]
  )
  
  return (
    <div
      className='flex flex-col justify-evenly gap-1' >
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