import KeyboardDefinition from "@lib/keyboardDefinition";
import KeyLabel, { ZoneKey } from "@lib/keyLabel";
import KeyMap from "@lib/keyMap";
import KeyStroke from "@lib/keyStroke";
import { AbstractTouchGesture, TouchGestureType } from "@lib/touchGesture";

export const nDia = new KeyboardDefinition('nDia', [
  [
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'ñ'], // tilde
        [new ZoneKey('center', 'shift'), 'Ñ'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ñ')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'ň'], // caron
        [new ZoneKey('center', 'shift'), 'Ň'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ň')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'n'], // plain
        [new ZoneKey('center', 'shift'), 'N'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('n')],
      ])
    },
  ]
])