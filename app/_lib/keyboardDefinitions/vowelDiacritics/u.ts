import KeyboardDefinition from "@lib/keyboardDefinition"
import { KeyDefinition } from "@lib/keyDefinition"
import KeyLabel, { ZoneKey } from "@lib/keyLabel"
import KeyMap from "@lib/keyMap"
import KeyStroke from "@lib/keyStroke"
import { AbstractTouchGesture, TouchGestureType } from "@lib/touchGesture"

export const uDia = new KeyboardDefinition('uDia', [
  [
    new KeyDefinition({
      label: new KeyLabel([
        [new ZoneKey('center'), 'ú'], // accent
        [new ZoneKey('center', 'shift'), 'Ú'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ú')],
      ])
    }),
    new KeyDefinition({
      label: new KeyLabel([
        [new ZoneKey('center'), 'ù'], // grave
        [new ZoneKey('center', 'shift'), 'Ù'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ù')],
      ])
    }),
    new KeyDefinition({
      label: new KeyLabel([
        [new ZoneKey('center'), 'ü'], // dieresis
        [new ZoneKey('center', 'shift'), 'Ü'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ü')],
      ])
    }),
    new KeyDefinition({
      label: new KeyLabel([
        [new ZoneKey('center'), 'û'], // circumflex
        [new ZoneKey('center', 'shift'), 'Û'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('û')],
      ])
    }),
    new KeyDefinition({
      label: new KeyLabel([
        [new ZoneKey('center'), 'ů'], // ring
        [new ZoneKey('center', 'shift'), 'Ů'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ů')],
      ])
    }),
    new KeyDefinition({
      label: new KeyLabel([
        [new ZoneKey('center'), 'ũ'], // tilde
        [new ZoneKey('center', 'shift'), 'Ũ'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ũ')],
      ])
    }),
    new KeyDefinition({
      label: new KeyLabel([
        [new ZoneKey('center'), 'u'], // plain
        [new ZoneKey('center', 'shift'), 'U'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('u')],
      ])
    }),
  ]
])
