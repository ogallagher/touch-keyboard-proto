import KeyboardDefinition from "@lib/keyboardDefinition";
import KeyLabel, { ZoneKey } from "@lib/keyLabel";
import KeyMap from "@lib/keyMap";
import KeyStroke from "@lib/keyStroke";
import { AbstractTouchGesture, TouchGestureType } from "@lib/touchGesture";

export const yDia = new KeyboardDefinition('yDia', [
  [
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'ý'], // accent
        [new ZoneKey('center', 'shift'), 'Ý'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ý')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'ỳ'], // grave
        [new ZoneKey('center', 'shift'), 'Ỳ'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ỳ')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'ÿ'], // dieresis
        [new ZoneKey('center', 'shift'), 'Ÿ'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ÿ')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'ŷ'], // circumflex
        [new ZoneKey('center', 'shift'), 'Ŷ'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ŷ')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'ȳ'], // macron
        [new ZoneKey('center', 'shift'), 'Ȳ'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ȳ')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'ỹ'], // tilde
        [new ZoneKey('center', 'shift'), 'Ỹ'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ỹ')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'y'], // plain
        [new ZoneKey('center', 'shift'), 'Y'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('y')],
      ])
    },
  ]
])