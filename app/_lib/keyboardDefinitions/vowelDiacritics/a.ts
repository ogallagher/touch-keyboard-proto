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
        [new ZoneKey('center', 'shift'), 'Á'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('á')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'à'], // grave
        [new ZoneKey('center', 'shift'), 'À'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('à')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'ä'], // dieresis
        [new ZoneKey('center', 'shift'), 'Ä'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ä')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'â'], // circumflex
        [new ZoneKey('center', 'shift'), 'Â'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('â')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'ā'], // macron
        [new ZoneKey('center', 'shift'), 'Ā'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ā')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'å'], // ring
        [new ZoneKey('center', 'shift'), 'Å'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('å')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'ã'], // tilde
        [new ZoneKey('center', 'shift'), 'Ã'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('ã')],
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'a'], // plain
        [new ZoneKey('center', 'shift'), 'A'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('a')],
      ])
    },
  ]
])