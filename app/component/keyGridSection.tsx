import { AddKeyGrid, KeyGridCtx } from "@context/keyGridCtx"
import KeyGrid from "@component/keyGrid"
import { JSX, useContext, useEffect, useRef, useState } from "react"
import { frthenKeyboard } from "@lib/keyboardDefinitions/eng_frthen"
import { KeyboardInstance, KeyboardPersistance, KeyboardSize } from "@lib/keyboardDefinition"
import { ConfigCtx } from "@context/configCtx"

export default function KeyGridSection() {
  /*
    Type is collection, but current implementation limits size to 1, so that only a single keyboard
    grid is in the page DOM at a time. The full list of keyboards that can be rendered is maintained
    in KeyGridCtx.
  */
  const [children, setChildren] = useState(new Map() as Map<string, JSX.Element>)
  const keyGridState = useContext(KeyGridCtx)
  const configCtx = useContext(ConfigCtx)
  const addChild = useRef(null as unknown as AddKeyGrid)

  // update definition of add
  useEffect(
    () => {
      if (!(keyGridState && configCtx)) {
        return
      }

      addChild.current = (keyboard, configurable, onClose?) => {
        // replace single child
        const newChildren = new Map()
        newChildren.set(
          keyboard.instanceId, 
          <KeyGrid 
            key={`${children.size}@${new Date().toISOString()}`} 
            keyboard={keyboard} onClose={onClose}
            configurable={configurable} />
        )
        
        setChildren(new Map(newChildren.entries()))

        // select for config
        configCtx.loadKeyboard(keyboard)
      }

      keyGridState.setAddKeyGrid((keyboard, configurable, onClose) => { 
        addChild.current(keyboard, configurable, onClose)
      })
    },
    [ keyGridState, children, children.size, configCtx ]
  )
  // update definition of delete
  useEffect(
    () => {
      if (!keyGridState) return

      keyGridState.setDeleteKeyGrid((keyboardInstanceId) => {
        children.delete(keyboardInstanceId)
        setChildren(new Map(children.entries()))
        
        if (configCtx && configCtx.keyboardInstance?.instanceId === keyboardInstanceId) {
          configCtx.unloadKeyboard()
        }
      })
    },
    [ keyGridState, children, configCtx ]
  )
  
  // add default grid
  useEffect(
    () => {
      if (children.size === 0 && keyGridState) {
        const keyboards = keyGridState.keyboards

        if (keyboards.length === 0) {
          // add default keyboard
          keyGridState.addKeyGrid(
            new KeyboardInstance(
              frthenKeyboard,
              { 
                index: children.size,
                persistance: KeyboardPersistance.Indefinite, 
                size: KeyboardSize.Fill 
              }
            ),
            true
          )
        }
        else {
          // add latest session keyboard
          addChild.current(keyboards[keyboards.length-1], true)
        }
      }
    },
    [ keyGridState, children.size ]
  )
  
  return (
    <div className='relative grow' >
      {[...children.values()]}
    </div>
  )
}