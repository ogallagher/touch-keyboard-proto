import { KeyGridCtx } from "@context/keyGridCtx"
import KeyGrid from "@component/keyGrid"
import { JSX, useContext, useEffect, useState } from "react"
import { frthenKeyboard } from "@lib/keyboardDefinitions/eng_frthen"
import { KeyboardInstance, KeyboardPersistance, KeyboardSize } from "@lib/keyboardDefinition"
import { ConfigCtx } from "@context/configCtx"

export default function KeyGridSection() {
  const [children, setChildren] = useState(new Map() as Map<string, JSX.Element>)
  const keyGridState = useContext(KeyGridCtx)
  const configCtx = useContext(ConfigCtx)

  // update definition of addGrid
  useEffect(
    () => {
      if (!(keyGridState && configCtx)) {
        return
      }

      keyGridState.addKeyGrid = (keyboard, configurable, onClose) => {  
        children.set(
          keyboard.keyboard.name, 
          <KeyGrid 
            key={`${children.size}@${new Date().toISOString()}`} 
            keyboard={keyboard} onClose={onClose}
            configurable={configurable} />
        )
        
        setChildren(new Map(children.entries()))

        configCtx.loadKeyboard(keyboard)
      }
    },
    [ keyGridState, children, configCtx ]
  )
  
  // add default grid
  useEffect(
    () => {
      if (children.size === 0 && keyGridState) {
        keyGridState.addKeyGrid(
          new KeyboardInstance(
            frthenKeyboard,
            { persistance: KeyboardPersistance.Indefinite, size: KeyboardSize.Fill }
          ),
          true
        )
      }
    },
    [ keyGridState ]
  )
  
  return (
    <div className='relative grow' >
      {[...children.values()]}
    </div>
  )
}