import KeyboardDefinition from "@lib/keyboardDefinition"
import KeyLabel, { ZoneKey } from "@lib/keyLabel"
import KeyMap from "@lib/keyMap"
import KeyStroke from "@lib/keyStroke"
import { AbstractTouchGesture, TouchGestureType } from "@lib/touchGesture"

export const iDia = new KeyboardDefinition('iDia', [
  [
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'í'], // accent
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('í')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'ì'], // grave
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ì')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'ï'], // dieresis
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ï')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'î'], // circumflex
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('î')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'ī'], // macron
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ī')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'ĩ'], // tilde
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ĩ')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'i'], // plain
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('i')],
      ])
    },
  ]
])
