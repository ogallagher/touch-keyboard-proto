import { ConfigCtx, configListenerName } from "@context/configCtx"
import { KeyIndex } from "@lib/keyboardDefinition"
import { KeyDefinition } from "@lib/keyDefinition"
import KeyLabel, { Zone } from "@lib/keyLabel"
import KeyMap from "@lib/keyMap"
import KeyStroke from "@lib/keyStroke"
import { AbstractTouchGesture } from "@lib/touchGesture"

import { useContext, useEffect, useRef, useState } from "react"
import GestureTypeLabel from "./gestureType"
import KeyZoneLabel from "@component/keyZoneLabel"
import { KeyGridCtx } from "@context/keyGridCtx"

export default function ConfigKeyCell() {
  const configCtx = useContext(ConfigCtx)
  const gridCtx = useContext(KeyGridCtx)
  const keyIndex = useRef({row: -1, col: -1} as KeyIndex)
  const [keyLabel, setKeyLabel] = useState(undefined as KeyLabel|undefined)
  const keyMap = useRef(undefined as KeyMap|undefined)
  const [keyStroke, setKeyStroke] = useState(undefined as KeyStroke|undefined)
  const [gesture, setGesture] = useState(undefined as AbstractTouchGesture|undefined)

  // init on new config context
  useEffect(
    () => {
      const name = configListenerName(ConfigKeyCell.name)
      configCtx.addLoadListener(name, () => {
        let key: KeyDefinition|undefined
        if (configCtx.keyboardInstance && configCtx.keyIndex) {
          keyIndex.current = configCtx.keyIndex
          key = configCtx.keyboardInstance.keyboard.getKey(configCtx.keyIndex.row, configCtx.keyIndex.col)
        }

        setKeyLabel(key?.label)
        keyMap.current = key?.map
        setKeyStroke(configCtx.keystroke?.clone())
        setGesture(configCtx.gesture?.clone())
      })

      return () => configCtx.deleteLoadListener(name)
    },
    []
  )

  // write to config context
  useEffect(
    () => {
      if (keyLabel && keyMap.current) {
        if (gesture) {
          keyMap.current.set(gesture, keyStroke)
        }

        const keyDef = new KeyDefinition({ label: keyLabel, map: keyMap.current })
        if (!keyDef.equals(configCtx.getKeyDefinition(keyIndex.current)!)) {
          configCtx.setKey(keyIndex.current, keyDef)
        }
      }
    },
    [ keyLabel, keyStroke ]
  )

  // TODO listen to modifier keys
  
  return (
    <div
      className='flex flex-col justify-between gap-1 text-xl' >
      {/* gesture */}
      <div
        className='flex flex-row gap-1 justify-center text-7xl' >
        <GestureTypeLabel gesture={gesture} />
      </div>
      {/* key label */}
      <div
        className='grid grid-cols-3 gap-1' >
        {(['upleft', 'up', 'upright', 'left', 'center', 'right', 'downleft', 'down', 'downright'] as Zone[]).map(
          (zone) => (
            <div key={`wrap-${zone}`} className='dark:bg-zinc-700 bg-zinc-300 rounded-lg'>
              <KeyZoneLabel 
                key={zone} 
                zone={zone} label={keyLabel} 
                isShift={false} isCapsLock={false} gestureSegment={undefined}
                setKeyLabel={keyLabel ? setKeyLabel : undefined} />
            </div>
          )
        )}
      </div>
      {/* key map */}
      <div
        className='flex flex-row justify-start gap-2' >
        <label>keystroke</label>
        <input 
          className='field-sizing-content min-w-8'
          value={keyStroke?.toChars().join('') || ''}
          placeholder='none'
          onChange={e => setKeyStroke(KeyStroke.parse(e.target.value))} />
      </div>
    </div>
  )
}