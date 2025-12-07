import { AddKeyGrid, KeyGridCtx } from "@context/keyGridCtx"
import KeyGrid from "@component/keyGrid"
import { JSX, useContext, useEffect, useRef, useState } from "react"
import { frthenKeyboard } from "@lib/keyboardDefinitions/eng_frthen"
import { KeyboardInstance, KeyboardPersistence, KeyboardSize } from "@lib/keyboardDefinition"
import { ConfigCtx } from "@context/configCtx"
import { exportShareUrlKeyboardsQueryKey } from "@lib/path"
import { useSearchParams } from "next/navigation"
import { decompressString } from "@lib/data"
import { switchKeyboardName } from "@lib/keyboardDefinitions/meta/switchKeyboard"
import { qwertyAlphabet } from "@lib/keyboardDefinitions/eng_qwerty"
import { listenerName } from "@lib/eventSync"

export default function KeyGridSection() {
  /*
    Type is collection, but current implementation limits size to 1, so that only a single keyboard
    grid is in the page DOM at a time. The full list of keyboards that can be rendered is maintained
    in KeyGridCtx.
  */
  const [children, setChildren] = useState(new Map() as Map<string, JSX.Element>)
  const keyGridState = useContext(KeyGridCtx)
  const configCtx = useContext(ConfigCtx)
  const searchQueryParams = useSearchParams()
  const addChild = useRef(null as unknown as AddKeyGrid)
  const loadedSearchQuery = useRef(false)
  const [gridViewportHeight, setGridViewportHeight] = useState(undefined as number|undefined)

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
            key={`${keyboard.instanceId}@${new Date().toISOString()}`} 
            keyboard={keyboard} onClose={onClose}
            configurable={configurable} />
        )
        
        setChildren(new Map(newChildren.entries()))

        if (configurable) {
          // select for config
          configCtx.loadKeyboard(keyboard)
        }
      }

      keyGridState.setAddKeyGrid((keyboard, configurable, onClose) => { 
        addChild.current(keyboard, configurable, onClose)
      })
    },
    [ keyGridState, configCtx ]
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

  // read viewport height from config ctx
  useEffect(
    () => {
      if (!configCtx) return

      const name = listenerName(KeyGridSection.name)
      configCtx.addSaveListener(name, 'KeyGridViewportHeight', () => {
        setGridViewportHeight(configCtx.gridViewportHeight)
      })

      return () => configCtx.deleteSaveListener(name, 'KeyGridViewportHeight')
    },
     [ configCtx ]
  )

  // load keyboards from search query
  useEffect(
    () => {
      if (!keyGridState || !searchQueryParams || loadedSearchQuery.current) return

      const keyboardsCompressed = searchQueryParams.get(exportShareUrlKeyboardsQueryKey)
      if (keyboardsCompressed) {
        const keyboardsStr = (
          decompressString(keyboardsCompressed)
          .trimStart()
        )
        const keyboardInstances: KeyboardInstance[] = []
        if (keyboardsStr[0] === '[') {
          keyboardInstances.push(...KeyboardInstance.loadMany(keyboardsStr))
        }
        else {
          keyboardInstances.push(KeyboardInstance.load(keyboardsStr))
        }
        console.info(`loaded count=${keyboardInstances.length} keyboard instances from url search query`)
        keyboardInstances.forEach((keyboardInstance) => {
          keyGridState.addKeyGrid(keyboardInstance, true)
        })
      }
      loadedSearchQuery.current = true
    },
    [ keyGridState, searchQueryParams, children.size ]
  )
  
  // add keyboard grid when empty
  useEffect(
    () => {
      if (children.size === 0 && keyGridState) {
        const keyboards = (
          keyGridState.keyboards
          // exclude meta
          .filter(kbi => kbi.instanceId !== switchKeyboardName)
        )

        if (keyboards.length === 0) {
          // add default keyboards
          keyGridState.addKeyGrid(
            new KeyboardInstance(
              qwertyAlphabet,
              {
                index: 0,
                persistence: KeyboardPersistence.Indefinite,
                size: KeyboardSize.Fill,
                canDelete: false
              }
            ),
            true
          )

          keyGridState.addKeyGrid(
            new KeyboardInstance(
              frthenKeyboard,
              { 
                index: 1,
                persistence: KeyboardPersistence.Indefinite, 
                size: KeyboardSize.Fill,
                canDelete: false
              }
            ),
            true
          )
        }
        else {
          // add latest session keyboard
          addChild.current(
            keyboards[keyboards.length-1], 
            true
          )
        }
      }
    },
    [ keyGridState, children.size ]
  )
  
  return (
    <div 
      className={[
        'relative',
        (gridViewportHeight ? '' : 'grow')
      ].join(' ')}
      style={!gridViewportHeight ? undefined : {
        height: `${Math.round(gridViewportHeight)}em`
      }} >
      {Array.from(children.values())}
    </div>
  )
}