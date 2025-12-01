import GridDimensions from "@lib/gridDimensions"
import KeyboardDefinition, { KeyboardInstance, KeyboardPersistence, KeyboardSize } from "@lib/keyboardDefinition"
import { KeyDefinition } from "@lib/keyDefinition"
import KeyLabel, { ZoneKey } from "@lib/keyLabel"
import KeyMap from "@lib/keyMap"
import { AbstractTouchGesture, TouchGestureType } from "@lib/touchGesture"

export const switchKeyboardName = 'metaSwitchKeyboard'

/**
 * Switch to another keyboard. Keys are determined at runtime.
 */
export function getSwitchKeyboard(
  keyboards: KeyboardInstance[],
  instanceOpts: {
    persistence: KeyboardPersistence
    size: KeyboardSize
    index?: number
  }
) {
  // exclude self
  keyboards = keyboards.filter(kbi => kbi.instanceId !== switchKeyboardName)
  
  const dims = new GridDimensions(1, keyboards.length)

  const keys: KeyDefinition[][] = (
    Array.from(new Array(dims.height))
    .map(() => new Array(dims.width))
  )
  
  let c = 0, r = 0
  for (const kbi of keyboards) {
    keys[r][c] = new KeyDefinition({
      label: new KeyLabel([
        [new ZoneKey('center'), kbi.keyboard.name]
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), kbi]
      ])
    })

    c++
    if (c >= dims.width) {
      c = 0
      r++
    }
  }

  return new KeyboardInstance(
    new KeyboardDefinition(
      switchKeyboardName,
      keys
    ),
    {
      ...instanceOpts, 
      // prevent concurrent instances of this keyboard
      instanceId: switchKeyboardName,
      cloneKeyboard: false
    }
  )
}
