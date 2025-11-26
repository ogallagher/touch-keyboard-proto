import { ConfigCtx, configListenerName } from "@context/configCtx"
import { KeyDefinition } from "@lib/keyboardDefinition"
import KeyLabel from "@lib/keyLabel"
import KeyMap from "@lib/keyMap"
import KeyStroke from "@lib/keyStroke"
import { AbstractTouchGesture } from "@lib/touchGesture"

import { useContext, useEffect, useState } from "react"
import GestureTypeLabel from "./gestureType"

export default function ConfigKeyCell() {
  const configCtx = useContext(ConfigCtx)
  const [keyLabel, setKeyLabel] = useState(undefined as KeyLabel|undefined)
  const [keyMap, setKeyMap] = useState(undefined as KeyMap|undefined)
  const [keyStroke, setKeyStroke] = useState(undefined as KeyStroke|undefined)
  const [gesture, setGesture] = useState(undefined as AbstractTouchGesture|undefined)

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
      // TODO config key cell write
    },
    [ keyLabel, keyStroke, keyMap ]
  )
  
  return (
    <div
      className='flex flex-col justify-between gap-1 text-xl' >
      {/* gesture */}
      <div
        className='flex flex-row gap-1 justify-center text-7xl' >
        <GestureTypeLabel gesture={gesture} />
        {/* <div>
          {directionToIcon(gesture?.direction)}
        </div>
        <div>{gesture?.cornerDirection && directionToIcon(gesture.cornerDirection)}</div> */}
      </div>
      {/* key label */}
      <div
        className='grid grid-cols-3 gap-1' >
        {/* row 1 */}
        <pre className="text-center">{keyLabel?.getZone('upleft')}&nbsp;</pre>
        <pre className="text-center">{keyLabel?.getZone('up')}&nbsp;</pre>
        <pre className="text-center">{keyLabel?.getZone('upright')}&nbsp;</pre>
        {/* row 2 */}
        <pre className="text-center">{keyLabel?.getZone('left')}&nbsp;</pre>
        <pre className="text-center">{keyLabel?.getZone('center')}&nbsp;</pre>
        <pre className="text-center">{keyLabel?.getZone('right')}&nbsp;</pre>
        {/* row 3 */}
        <pre className="text-center">{keyLabel?.getZone('downleft')}&nbsp;</pre>
        <pre className="text-center">{keyLabel?.getZone('down')}&nbsp;</pre>
        <pre className="text-center">{keyLabel?.getZone('downright')}&nbsp;</pre>
      </div>
      {/* key map */}
      <div
        className='flex flex-row justify-start' >
        {'keystroke: ' + keyStroke?.toString()}
      </div>
    </div>
  )
}