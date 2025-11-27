import IncDec from "@component/incDec"
import { ConfigCtx, configListenerName } from "@context/configCtx"
import { Orientation } from "@lib/orientation"
import { useContext, useEffect, useState } from "react"

export default function ConfigKeyGrid() {
  const configCtx = useContext(ConfigCtx)
  const [gridDimensions, setGridDimensions] = useState(configCtx.keyboardInstance?.keyboard.dimensions)
  const [keyboardName, setKeyboardName] = useState(configCtx.keyboardInstance?.keyboard.name)

  // init on new config context
  useEffect(
    () => {
      const name = configListenerName(ConfigKeyGrid.name)
      configCtx.addLoadListener(name, () => {
        setGridDimensions(configCtx.keyboardInstance?.keyboard.dimensions)
        setKeyboardName(configCtx.keyboardInstance?.keyboard.name)
      })

      return () => configCtx.deleteLoadListener(name)
    },
    []
  )

  // write to config context
  useEffect(
    () => {
      if (configCtx.keyboardInstance && keyboardName) {
        configCtx.keyboardInstance.keyboard.name = keyboardName
      }
    },
    [ keyboardName ]
  )

  useEffect(
    () => {
      if (configCtx.keyboardInstance && gridDimensions) {
        configCtx.setGridDimensions(gridDimensions)
      }
    },
    [ gridDimensions ]
  )
  
  return (
    <div
      className='flex flex-col justify-evenly gap-1' >
      {/* grid dimensions */}
      <div
        className='flex flex-row text-2xl'>
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
      <div
        className='flex flex-row justify-between gap-1' >
        {/* name */}
        name: 
        <input
          type='text'
          value={keyboardName || 'no keyboard loaded'} 
          onChange={e => setKeyboardName(e.target.value)} />
      </div>
    </div>
  )
}