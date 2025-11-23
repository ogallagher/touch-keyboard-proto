import KeyboardDefinition from "@lib/keyboardDefinition"
import KeyLabel, { ZoneKey } from "@lib/keyLabel"
import KeyMap from "@lib/keyMap"
import KeyStroke from "@lib/keyStroke"
import { AbstractTouchGesture, TouchGestureType } from "@lib/touchGesture"

export const oDia = new KeyboardDefinition('oDia', [
  [
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'ó'], // accent
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ó')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'ò'], // grave
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ò')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'ö'], // dieresis
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ö')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'ô'], // circumflex
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ô')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'ō'], // macron
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ō')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'õ'], // tilde
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('õ')],
      ])
    },
  ]
])
