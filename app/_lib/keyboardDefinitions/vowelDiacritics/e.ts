import KeyboardDefinition from "@lib/keyboardDefinition"
import KeyLabel, { ZoneKey } from "@lib/keyLabel"
import KeyMap from "@lib/keyMap"
import KeyStroke from "@lib/keyStroke"
import { AbstractTouchGesture, TouchGestureType } from "@lib/touchGesture"

export const eDia = new KeyboardDefinition('eDia', [
  [
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'é'], // accent
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('é')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'è'], // grave
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('è')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'ë'], // dieresis
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ë')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'ê'], // circumflex
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ê')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'ē'], // macron
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ē')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'e'], // plain
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('e')],
      ])
    },
  ]
])
