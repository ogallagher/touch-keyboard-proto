import KeyboardDefinition, { KeyboardInstance, KeyboardPersistence, KeyboardSize } from "@lib/keyboardDefinition"
import { KeyDefinition } from "@lib/keyDefinition"
import KeyLabel, { ZoneKey } from "@lib/keyLabel"
import KeyMap from "@lib/keyMap"
import KeyStroke, { MetaChar } from "@lib/keyStroke"
import { Cardinal, Direction } from "@lib/orientation"
import { AbstractTouchGesture, InitGestureSegmentType, TouchGestureType } from "@lib/touchGesture"
import { digits1key } from "./digits1key"
import { eDia } from "./vowelDiacritics/e"
import { aDia } from "./vowelDiacritics/a"
import { uDia } from "./vowelDiacritics/u"
import { iDia } from "./vowelDiacritics/i"
import { oDia } from "./vowelDiacritics/o"
import { nDia } from "./consonantDiacritics/n"
import { yDia } from "./pseudovowelDiacritics/y"
import { getReshapedKeyboard } from "./meta/reshape"

// row 0 = f r t
const row0: KeyDefinition[] = [
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), 'f'],
      [new ZoneKey('down'), 'v'],
      [new ZoneKey('right'), '123'],
      [new ZoneKey('left'), '⋮'],
      [new ZoneKey('center', 'shift'), 'F'],
      [new ZoneKey('down', 'shift'), 'V']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('f')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.DOWN), new KeyStroke('v')],
      [
        new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.RIGHT, undefined, false), 
        new KeyboardInstance(digits1key, { 
          persistence: KeyboardPersistence.Indefinite,
          size: KeyboardSize.Embed,
          keyOverrides: [
            {row: 0, col: 0, key: {
              label: new KeyLabel([
                [new ZoneKey('center', InitGestureSegmentType.CARDINAL_SWIPE, Cardinal.DOWN), 'ABC']
              ]),
              map: new KeyMap([
                [new AbstractTouchGesture(TouchGestureType.CARDINAL_RETURN_SWIPE, Direction.DOWN, undefined, false), new KeyStroke(MetaChar.CLOSE_KEYBOARD)]
              ])
            }}
          ]
        })
      ],
      [
        new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.LEFT, undefined, false), 
        new KeyStroke(MetaChar.SWITCH_KEYBOARD)
      ]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), 'r'],
      [new ZoneKey('left'), 'y'],
      [new ZoneKey('down'), 'w'],
      [new ZoneKey('right'), 're'],
      [new ZoneKey('center', InitGestureSegmentType.CARDINAL_SWIPE, Cardinal.RIGHT), 'er'],
      [new ZoneKey('center', 'shift'), 'R'],
      [new ZoneKey('left', 'shift'), 'Y'],
      [new ZoneKey('down', 'shift'), 'W'],
      [new ZoneKey('right', 'shift'), 'Re'],
      [new ZoneKey('right', 'capslock'), 'RE']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('r')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.LEFT), new KeyStroke('y')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.DOWN), new KeyStroke('w')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.RIGHT), new KeyStroke('r', 'e')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE_HOLD, Direction.RIGHT, undefined, false), new KeyStroke("'", 'r', 'e')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_RETURN_SWIPE, Direction.RIGHT), new KeyStroke('e', 'r')],

      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE_HOLD, Direction.LEFT), new KeyboardInstance(
        getReshapedKeyboard(yDia, { height: 2}),
        {
          persistence: KeyboardPersistence.Brief,
          size: KeyboardSize.Embed
        }
      )],
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), 't'],
      [new ZoneKey('left'), 'd'],
      [new ZoneKey('down'), 'th'],
      [new ZoneKey('right'), 'j'],
      [new ZoneKey('up'), 'to'],
      [new ZoneKey('center', 'shift'), 'T'],
      [new ZoneKey('left', 'shift'), 'D'],
      [new ZoneKey('down', 'shift'), 'Th'],
      [new ZoneKey('right', 'shift'), 'J'],
      [new ZoneKey('up', 'shift'), 'To'],
      [new ZoneKey('down', 'capslock'), 'TH'],
      [new ZoneKey('up', 'capslock'), 'TO']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('t')],
      [new AbstractTouchGesture(TouchGestureType.TOUCH_HOLD, undefined, undefined, false), new KeyStroke("'", 't')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.LEFT), new KeyStroke('d')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE_HOLD, Direction.LEFT, undefined, false), new KeyStroke("'", 'd')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.DOWN), new KeyStroke('th')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.RIGHT), new KeyStroke('j')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.UP), new KeyStroke('t', 'o')]
    ])
  })
]
// row 1 = h e n
const row1: KeyDefinition[] = [ 
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), 'h'],
      [new ZoneKey('left'), 'hi'],
      [new ZoneKey('right'), 'ha'],
      [new ZoneKey('up'), 'he'],
      [new ZoneKey('center', 'shift'), 'H'],
      [new ZoneKey('left', 'shift'), 'Hi'],
      [new ZoneKey('right', 'shift'), 'Ha'],
      [new ZoneKey('up', 'shift'), 'He'],
      [new ZoneKey('left', 'capslock'), 'HI'],
      [new ZoneKey('right', 'capslock'), 'HA'],
      [new ZoneKey('up', 'capslock'), 'HE']
  ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('h')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.LEFT), new KeyStroke('h', 'i')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.RIGHT), new KeyStroke('h', 'a')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.UP), new KeyStroke('h', 'e')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), 'e'],
      [new ZoneKey('left'), 'i'],
      [new ZoneKey('down'), 'u'],
      [new ZoneKey('right'), 'a'],
      [new ZoneKey('up'), 'o'],
      [new ZoneKey('center', 'shift'), 'E'],
      [new ZoneKey('left', 'shift'), 'I'],
      [new ZoneKey('down', 'shift'), 'U'],
      [new ZoneKey('right', 'shift'), 'A'],
      [new ZoneKey('up', 'shift'), 'O']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('e')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.LEFT), new KeyStroke('i')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.DOWN), new KeyStroke('u')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.RIGHT), new KeyStroke('a')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.UP), new KeyStroke('o')],

      [new AbstractTouchGesture(TouchGestureType.TOUCH_HOLD), new KeyboardInstance(
        getReshapedKeyboard(eDia, { height: 2 }),
        {
          persistence: KeyboardPersistence.Brief,
          size: KeyboardSize.Embed
        }
      )],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE_HOLD, Direction.RIGHT), new KeyboardInstance(
        getReshapedKeyboard(aDia, { height: 2 }),
        {
          persistence: KeyboardPersistence.Brief,
          size: KeyboardSize.Embed
        }
      )],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE_HOLD, Direction.DOWN), new KeyboardInstance(
        getReshapedKeyboard(uDia, { height: 2 }),
        {
          persistence: KeyboardPersistence.Brief,
          size: KeyboardSize.Embed
        }
      )],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE_HOLD, Direction.LEFT), new KeyboardInstance(
        getReshapedKeyboard(iDia, { height: 2 }),
        {
          persistence: KeyboardPersistence.Brief,
          size: KeyboardSize.Embed
        }
      )],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE_HOLD, Direction.UP), new KeyboardInstance(
        getReshapedKeyboard(oDia, { height: 2 }),
        {
          persistence: KeyboardPersistence.Brief,
          size: KeyboardSize.Embed
        }
      )],
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), 'n'],
      [new ZoneKey('left'), 'an'],
      [new ZoneKey('right'), 'in'],
      [new ZoneKey('down'), 'ng'],
      [new ZoneKey('up'), 'l'],
      [new ZoneKey('center', InitGestureSegmentType.CARDINAL_SWIPE, Cardinal.UP), 'nd'],
      [new ZoneKey('center', 'shift'), 'N'],
      [new ZoneKey('left', 'shift'), 'An'],
      [new ZoneKey('right', 'shift'), 'In'],
      [new ZoneKey('down', 'shift'), 'Ng'],
      [new ZoneKey('up', 'shift'), 'L'],
      [new ZoneKey('left', 'capslock'), 'AN'],
      [new ZoneKey('right', 'capslock'), 'IN'],
      [new ZoneKey('down', 'capslock'), 'NG']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('n')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.LEFT), new KeyStroke('a', 'n')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.DOWN), new KeyStroke('n', 'g')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.RIGHT), new KeyStroke('i', 'n')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.UP), new KeyStroke('l')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_RETURN_SWIPE, Direction.UP), new KeyStroke('n', 'd')],

      [new AbstractTouchGesture(TouchGestureType.TOUCH_HOLD), new KeyboardInstance(nDia,
        {
          persistence: KeyboardPersistence.Brief,
          size: KeyboardSize.Embed
        }
      )],
    ])
  })
]
// row 2 = s k p
const row2: KeyDefinition[] = [
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), 's'],
      [new ZoneKey('left'), 'z'],
      [new ZoneKey('right'), 'c'],
      [new ZoneKey('up'), 'sh'],
      [new ZoneKey('center', 'shift'), 'S'],
      [new ZoneKey('left', 'shift'), 'Z'],
      [new ZoneKey('right', 'shift'), 'C'],
      [new ZoneKey('up', 'shift'), 'Sh'],
      [new ZoneKey('up', 'capslock'), 'SH'],
      [new ZoneKey('upright', InitGestureSegmentType.CARDINAL_SWIPE, Cardinal.RIGHT), 'ch'],
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('s')],
      [new AbstractTouchGesture(TouchGestureType.TOUCH_HOLD, undefined, undefined, false), new KeyStroke("'", 's')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.LEFT), new KeyStroke('z')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.RIGHT), new KeyStroke('c')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.UP), new KeyStroke('s', 'h')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_CORNER_SWIPE, Direction.RIGHT, Direction.UP), new KeyStroke('c', 'h')],
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), 'k'],
      [new ZoneKey('down'), 'x'],
      [new ZoneKey('right'), 'q'],
      [new ZoneKey('up'), 'g'],
      [new ZoneKey('left'), '⌫'],
      [new ZoneKey('center', 'shift'), 'K'],
      [new ZoneKey('down', 'shift'), 'X'],
      [new ZoneKey('right', 'shift'), 'Q'],
      [new ZoneKey('up', 'shift'), 'G'],
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('k')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.DOWN), new KeyStroke('x')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.RIGHT), new KeyStroke('q')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.UP), new KeyStroke('g')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.LEFT), new KeyStroke(MetaChar.BACKSPACE)]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), 'p'],
      [new ZoneKey('left'), 'm'],
      [new ZoneKey('up'), 'b'],
      [new ZoneKey('center', 'shift'), 'P'],
      [new ZoneKey('left', 'shift'), 'M'],
      [new ZoneKey('up', 'shift'), 'B'],
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('p')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.LEFT), new KeyStroke('m')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.UP), new KeyStroke('b')]
    ])
  })
]
// row 3 = ' <space> .
const row3: KeyDefinition[] = [
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), "'"],
      [new ZoneKey('left'), '('],
      [new ZoneKey('right'), ')'],
      [new ZoneKey('up'), '"'],
      [new ZoneKey('down'), '⇧'],
      [new ZoneKey('down', InitGestureSegmentType.CARDINAL_SWIPE, Cardinal.DOWN), '⇪'],
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke("'")],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.LEFT), new KeyStroke('(')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE_HOLD, Direction.LEFT), new KeyStroke('[')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_RETURN_SWIPE, Direction.LEFT), new KeyStroke('{')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_RETURN_OVER_SWIPE, Direction.LEFT), new KeyStroke('{')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.RIGHT), new KeyStroke(')')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE_HOLD, Direction.RIGHT), new KeyStroke(']')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_RETURN_SWIPE, Direction.RIGHT), new KeyStroke('}')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_RETURN_OVER_SWIPE, Direction.RIGHT), new KeyStroke('}')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.UP), new KeyStroke('"')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.DOWN), new KeyStroke(MetaChar.SHIFT)],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE_HOLD, Direction.DOWN, undefined, false), new KeyStroke(MetaChar.CAPS_LOCK)],
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '[ ]'],
      [new ZoneKey('down'), '↩'],
      [new ZoneKey('left'), '←'],
      [new ZoneKey('right'), '→'],
      [new ZoneKey('up'), '↦'],
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke(' ')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.DOWN), new KeyStroke('\n')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.RIGHT), new KeyStroke(MetaChar.RIGHT)],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.LEFT), new KeyStroke(MetaChar.LEFT)],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.UP), new KeyStroke('\t')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '.'],
      [new ZoneKey('left'), '?'],
      [new ZoneKey('up'), '!'],
      [new ZoneKey('right'), ','],
      [new ZoneKey('down'), ':'],
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('.')],
      [new AbstractTouchGesture(TouchGestureType.TOUCH_HOLD, undefined, undefined, false), new KeyStroke('...')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.LEFT), new KeyStroke('?')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.RIGHT), new KeyStroke(',')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE_HOLD, Direction.RIGHT), new KeyStroke(';')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.UP), new KeyStroke('!')],
      [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.DOWN), new KeyStroke(':')]
    ])
  })
]

/**
 * First example English (compatible with some other latin alphabet languages including diacritics) touch keyboard.
 * Named after touch keystrokes in top two rows.
 */
export const frthenKeyboard = new KeyboardDefinition('frthen', [row0, row1, row2, row3])
