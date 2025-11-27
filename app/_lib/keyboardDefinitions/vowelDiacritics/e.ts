import KeyboardDefinition from "@lib/keyboardDefinition"
import { KeyDefinition } from "@lib/keyDefinition"
import KeyLabel, { ZoneKey } from "@lib/keyLabel"
import KeyMap from "@lib/keyMap"
import KeyStroke from "@lib/keyStroke"
import { AbstractTouchGesture, TouchGestureType } from "@lib/touchGesture"

export const eDia = new KeyboardDefinition('eDia', [
  [
    new KeyDefinition({
      label: new KeyLabel([
        [new ZoneKey('center'), 'é'], // accent
        [new ZoneKey('center', 'shift'), 'É'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('é')],
      ])
    }),
    new KeyDefinition({
      label: new KeyLabel([
        [new ZoneKey('center'), 'è'], // grave
        [new ZoneKey('center', 'shift'), 'È'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('è')],
      ])
    }),
    new KeyDefinition({
      label: new KeyLabel([
        [new ZoneKey('center'), 'ë'], // dieresis
        [new ZoneKey('center', 'shift'), 'Ë'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ë')],
      ])
    }),
    new KeyDefinition({
      label: new KeyLabel([
        [new ZoneKey('center'), 'ê'], // circumflex
        [new ZoneKey('center', 'shift'), 'Ê'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ê')],
      ])
    }),
    new KeyDefinition({
      label: new KeyLabel([
        [new ZoneKey('center'), 'ē'], // macron
        [new ZoneKey('center', 'shift'), 'Ē'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ē')],
      ])
    }),
    new KeyDefinition({
      label: new KeyLabel([
        [new ZoneKey('center'), 'e'], // plain
        [new ZoneKey('center', 'shift'), 'E'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('e')],
      ])
    }),
  ]
])
