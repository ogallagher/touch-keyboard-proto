import KeyboardDefinition from "@lib/keyboardDefinition"
import KeyLabel, { ZoneKey } from "@lib/keyLabel"
import KeyMap from "@lib/keyMap"
import KeyStroke, { MetaChar } from "@lib/keyStroke"
import { Cardinal, Direction } from "@lib/orientation"
import { AbstractTouchGesture, InnerTouchGestureSegmentType, TouchGestureType } from "@lib/touchGesture"

export const frthenKeyboard = new KeyboardDefinition([
  // row 1 = f r t
  [
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'f'],
        [new ZoneKey('down'), 'v'],
        [new ZoneKey('center', 'shift'), 'F'],
        [new ZoneKey('down', 'shift'), 'V']
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('f')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.DOWN), new KeyStroke('v')]
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'r'],
        [new ZoneKey('left'), 'y'],
        [new ZoneKey('down'), 'w'],
        [new ZoneKey('right'), 're'],
        [new ZoneKey('center', InnerTouchGestureSegmentType.CARDINAL_SWIPE, Cardinal.RIGHT), 'er'],
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
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_RETURN_SWIPE, Direction.RIGHT), new KeyStroke('e', 'r')]
      ])
    },
    {
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
    }
  ],
  // row 2 = h e n
  [ 
    {
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
    },
    {
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
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.UP), new KeyStroke('o')]
      ])
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), 'n'],
        [new ZoneKey('left'), 'an'],
        [new ZoneKey('right'), 'in'],
        [new ZoneKey('down'), 'ng'],
        [new ZoneKey('up'), 'l'],
        [new ZoneKey('center', InnerTouchGestureSegmentType.CARDINAL_SWIPE, Cardinal.UP), 'nd'],
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
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_RETURN_SWIPE, Direction.UP), new KeyStroke('n', 'd')]
      ])
    }
  ],
  // row 3 = s k p
  [
    {
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
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('s')],
        [new AbstractTouchGesture(TouchGestureType.TOUCH_HOLD, undefined, undefined, false), new KeyStroke("'", 's')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.LEFT), new KeyStroke('z')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.RIGHT), new KeyStroke('c')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.UP), new KeyStroke('s', 'h')]
      ])
    },
    {
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
    },
    {
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
    }
  ],
  // row 4 = ' <space> .
  [
    {
      label: new KeyLabel([
        [new ZoneKey('center'), "'"],
        [new ZoneKey('left'), '('],
        [new ZoneKey('right'), ')'],
        [new ZoneKey('up'), '"'],
        [new ZoneKey('down'), '⇪'],
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
    },
    {
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
    },
    {
      label: new KeyLabel([
        [new ZoneKey('center'), '.'],
        [new ZoneKey('left'), '?'],
        [new ZoneKey('up'), '!'],
        [new ZoneKey('right'), ','],
        [new ZoneKey('down'), ':'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('.')],
        [new AbstractTouchGesture(TouchGestureType.TOUCH_HOLD), new KeyStroke('...')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.LEFT), new KeyStroke('?')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.RIGHT), new KeyStroke(',')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE_HOLD, Direction.RIGHT), new KeyStroke(';')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.UP), new KeyStroke('!')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.DOWN), new KeyStroke(':')]
      ])
    }
  ]
])
