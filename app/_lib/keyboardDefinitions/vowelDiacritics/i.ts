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
        [new ZoneKey('center', 'shift'), 'Í'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('í')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'ì'], // grave
        [new ZoneKey('center', 'shift'), 'Ì'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ì')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'ï'], // dieresis
        [new ZoneKey('center', 'shift'), 'Ï'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ï')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'î'], // circumflex
        [new ZoneKey('center', 'shift'), 'Î'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('î')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'ī'], // macron
        [new ZoneKey('center', 'shift'), 'Ī'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ī')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'ĩ'], // tilde
        [new ZoneKey('center', 'shift'), 'Ĩ'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ĩ')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'i'], // plain
        [new ZoneKey('center', 'shift'), 'I'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('i')],
      ])
    },
  ]
])
