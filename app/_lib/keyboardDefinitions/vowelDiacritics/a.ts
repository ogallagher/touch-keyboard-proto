import KeyboardDefinition from "@lib/keyboardDefinition";
import KeyLabel, { ZoneKey } from "@lib/keyLabel";
import KeyMap from "@lib/keyMap";
import KeyStroke from "@lib/keyStroke";
import { AbstractTouchGesture, TouchGestureType } from "@lib/touchGesture";

export const aDia = new KeyboardDefinition('aDia', [
  [
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'á'], // accent
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('á')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'à'], // grave
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('à')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'ä'], // dieresis
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ä')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'â'], // circumflex
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('â')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'ā'], // macron
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ā')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'å'], // ring
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('å')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'ã'], // tilde
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ã')],
      ])
    }
  ]
])