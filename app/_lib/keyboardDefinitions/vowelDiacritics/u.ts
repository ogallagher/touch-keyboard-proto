import KeyboardDefinition from "@lib/keyboardDefinition"
import KeyLabel, { ZoneKey } from "@lib/keyLabel"
import KeyMap from "@lib/keyMap"
import KeyStroke from "@lib/keyStroke"
import { AbstractTouchGesture, TouchGestureType } from "@lib/touchGesture"

export const uDia = new KeyboardDefinition('uDia', [
  [
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'ú'], // accent
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ú')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'ù'], // grave
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ù')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'ü'], // dieresis
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ü')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'û'], // circumflex
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('û')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'ů'], // ring
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ů')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'ũ'], // tilde
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ũ')],
      ])
    },
  ]
])
