import { KeyGridCtx, KeyGridState } from "@context/keyGridCtx"
import KeyGrid from "@component/keyGrid"
import { Dispatch, JSX, SetStateAction, useContext, useEffect, useRef, useState } from "react"
import GridDimensions from "@lib/gridDimensions"
import { frthenKeyboard } from "@lib/keyboardDefinitions/eng_frthen"
import { KeyboardInstance, KeyboardPersistance, KeyboardSize } from "@lib/keyboardDefinition"
import { ConfigCtx } from "@context/configCtx"

export default function KeyGridSection(
  { setGridDimensions }: {
    setGridDimensions: Dispatch<SetStateAction<GridDimensions>>
  }
) {
  const [children, setChildren] = useState(new Map() as Map<string, JSX.Element>)
  const keyGridState = useRef(new KeyGridState())
  const configCtx = useContext(ConfigCtx)

  // define addGrid
  useEffect(
    () => {
      keyGridState.current.addKeyGrid.current = (keyboard: KeyboardInstance, onClose?: () => void) => {
        const gridDimensions = keyboard.keyboard.dimensions
        setGridDimensions(gridDimensions)
        
        children.set(
          keyboard.keyboard.name, 
          <KeyGrid 
            key={`${children.size}-@${new Date().getTime()}`} 
            dimensions={gridDimensions} keyboard={keyboard} onClose={onClose} />
        )
        setChildren(children)

        configCtx.loadKeyboard(keyboard)
      }
    },
    [ children ]
  )
  
  // add default grid
  useEffect(
    () => {
      if (children.size === 0) {
        keyGridState.current.addKeyGrid.current(new KeyboardInstance(
          frthenKeyboard,
          { persistance: KeyboardPersistance.Indefinite, size: KeyboardSize.Fill }
        ))
      }
    },
    [ children ]
  )
  
  return (
    <KeyGridCtx value={keyGridState}>
      <div className='relative grow' >
        {[...children.values()]}
      </div>
    </KeyGridCtx>
  )
}