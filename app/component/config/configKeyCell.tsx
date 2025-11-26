import { ConfigCtx, configListenerName } from "@context/configCtx"
import { KeyDefinition } from "@lib/keyboardDefinition"
import KeyLabel from "@lib/keyLabel"
import KeyMap from "@lib/keyMap"
import KeyStroke from "@lib/keyStroke"
import TouchGesture from "@lib/touchGesture"
import { useContext, useEffect, useState } from "react"

export default function ConfigKeyCell() {
  const configCtx = useContext(ConfigCtx)
  const [keyLabel, setKeyLabel] = useState(undefined as KeyLabel|undefined)
  const [keyMap, setKeyMap] = useState(undefined as KeyMap|undefined)
  const [keyStroke, setKeyStroke] = useState(undefined as KeyStroke|undefined)
  const [gesture, setGesture] = useState(undefined as TouchGesture|undefined)

  // init on new config context
  useEffect(
    () => {
      const name = configListenerName(ConfigKeyCell.name)
      configCtx.addLoadListener(name, () => {
        let key: KeyDefinition|undefined
        if (configCtx.keyboardInstance && configCtx.keyIndex) {
          key = configCtx.keyboardInstance.keyboard.getKey(configCtx.keyIndex.row, configCtx.keyIndex.col)
        }

        setKeyLabel(key?.label)
        setKeyMap(key?.map)
        setKeyStroke(configCtx.keystroke)
        setGesture(configCtx.gesture)
      })

      return () => configCtx.deleteLoadListener(name)
    },
    []
  )

  // write to config context
  useEffect(
    () => {
      // TODO config key cell write
    },
    [ keyLabel, keyStroke, keyMap ]
  )
  
  return (
    <div
      className='flex flex-col justify-between gap-1' >
      {/* gesture */}
      <div
        className='flex flex-row justify-start' >
        {'g: ' + gesture?.toString()}
      </div>
      {/* key label */}
      <div
        className='flex flex-row justify-start' >
        {'L: ' + keyLabel?.getZone('center')}
      </div>
      {/* key map */}
      <div
        className='flex flex-row justify-start' >
        {'s: ' + keyStroke?.toString()}
      </div>
    </div>
  )
}