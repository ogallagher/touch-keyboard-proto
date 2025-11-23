import { KeyGridCtx, KeyGridState } from "@context/keyGridCtx"
import KeyGrid from "@component/keyGrid"
import { Dispatch, JSX, SetStateAction, useEffect, useRef, useState } from "react"
import GridDimensions from "@lib/gridDimensions"
import { frthenKeyboard } from "@lib/keyboardDefinitions/eng_frthen"
import KeyboardDefinition from "@lib/keyboardDefinition"

export default function KeyGridSection(
  { setGridDimensions }: {
    setGridDimensions: Dispatch<SetStateAction<GridDimensions>>
  }
) {
  const [children, setChildren] = useState(new Map() as Map<string, JSX.Element>)
  const keyGridState = useRef(new KeyGridState())

  // define addGrid
  useEffect(
    () => {
      keyGridState.current.addKeyGrid.current = (keyboard: KeyboardDefinition, onClose?: () => void) => {
        const gridDimensions = keyboard.dimensions
        setGridDimensions(gridDimensions)
        
        children.set(
          keyboard.name, 
          <KeyGrid 
            key={`${children.size}-@${new Date().getTime()}`} 
            dimensions={gridDimensions} keyboard={keyboard} onClose={onClose} />
        )
        setChildren(children)
      }
    },
    [ children ]
  )
  
  // add default grid
  useEffect(
    () => {
      if (children.size === 0) {
        keyGridState.current.addKeyGrid.current(frthenKeyboard)
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