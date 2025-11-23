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
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ý')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'ỳ'], // grave
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ỳ')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'ÿ'], // dieresis
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ÿ')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'ŷ'], // circumflex
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ŷ')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'ȳ'], // macron
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ȳ')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'ỹ'], // tilde
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ỹ')],
      ])
    }
  ]
])