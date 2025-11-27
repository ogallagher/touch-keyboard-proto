import KeyboardDefinition from "@lib/keyboardDefinition"
import { KeyDefinition } from "@lib/keyDefinition"
import KeyLabel, { ZoneKey } from "@lib/keyLabel"
import KeyMap from "@lib/keyMap"
import KeyStroke from "@lib/keyStroke"
import { AbstractTouchGesture, TouchGestureType } from "@lib/touchGesture"

export const oDia = new KeyboardDefinition('oDia', [
  [
    new KeyDefinition({
      label: new KeyLabel([
        [new ZoneKey('center'), 'ó'], // accent
        [new ZoneKey('center', 'shift'), 'Ó'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ó')],
      ])
    }),
    new KeyDefinition({
      label: new KeyLabel([
        [new ZoneKey('center'), 'ò'], // grave
        [new ZoneKey('center', 'shift'), 'Ò'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ò')],
      ])
    }),
    new KeyDefinition({
      label: new KeyLabel([
        [new ZoneKey('center'), 'ö'], // dieresis
        [new ZoneKey('center', 'shift'), 'Ö'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ö')],
      ])
    }),
    new KeyDefinition({
      label: new KeyLabel([
        [new ZoneKey('center'), 'ô'], // circumflex
        [new ZoneKey('center', 'shift'), 'Ô'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ô')],
      ])
    }),
    new KeyDefinition({
      label: new KeyLabel([
        [new ZoneKey('center'), 'ō'], // macron
        [new ZoneKey('center', 'shift'), 'Ō'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ō')],
      ])
    }),
    new KeyDefinition({
      label: new KeyLabel([
        [new ZoneKey('center'), 'õ'], // tilde
        [new ZoneKey('center', 'shift'), 'Õ'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('õ')],
      ])
    }),
    new KeyDefinition({
      label: new KeyLabel([
        [new ZoneKey('center'), 'o'], // plain
        [new ZoneKey('center', 'shift'), 'O'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('o')],
      ])
    }),
  ]
])
