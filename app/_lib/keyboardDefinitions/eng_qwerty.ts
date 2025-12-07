import GridDimensions from "@lib/gridDimensions"
import KeyboardDefinition, { KeyboardInstance, KeyboardPersistence, KeyboardSize } from "@lib/keyboardDefinition"
import { KeyDefinition } from "@lib/keyDefinition"
import KeyLabel, { ZoneKey } from "@lib/keyLabel"
import KeyMap from "@lib/keyMap"
import KeyStroke, { MetaChar } from "@lib/keyStroke"
import { AbstractTouchGesture, TouchGestureType } from "@lib/touchGesture"
import { eDia } from "./vowelDiacritics/e"
import { yDia } from "./pseudovowelDiacritics/y"
import { uDia } from "./vowelDiacritics/u"
import { iDia } from "./vowelDiacritics/i"
import { oDia } from "./vowelDiacritics/o"
import { aDia } from "./vowelDiacritics/a"
import { nDia } from "./consonantDiacritics/n"

// more-symbols
// row 0 = [ ] { } # % ^ * + =
const bracketBrace: KeyDefinition[] = [
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '[']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('[')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), ']']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke(']')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '{']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('{')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '}']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('}')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '#']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('#')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '%']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('%')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '^']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('^')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '*']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('*')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '+']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('+')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '=']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('=')]
    ])
  }),
]
// row 1 = _ \ | ~ < > <euro> <pound> <yen> •
const floorSlashPipe: KeyDefinition[] = [
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '_']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('_')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '\\']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('\\')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '|']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('|')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '~']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('~')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '<']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('<')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '>']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('>')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '€']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('€')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '£']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('£')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '¥']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('¥')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '•']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('•')]
    ])
  }),
]
// row 2 = <digits-symbols/close-keyboard> [. , ? ! ' <backspace>]
const punctuation: KeyDefinition[] = [
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '.']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('.')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), ',']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke(',')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '?']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('?')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '!']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('!')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), "'"]
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke("'")]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '⌫']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke(MetaChar.BACKSPACE)]
    ]),
    dimensions: new GridDimensions(3, 1)
  }),
  KeyDefinition.empty(),
  KeyDefinition.empty(),
]
// row 3 = <alphabet-pending> [<switch-keyboard> <space> <newline>]
const control: KeyDefinition[] = [
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '🌐']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke(MetaChar.SWITCH_KEYBOARD)]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), 'space'],
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke(' ')]
    ]),
    dimensions: new GridDimensions(5, 1)
  }),
  KeyDefinition.empty(),
  KeyDefinition.empty(),
  KeyDefinition.empty(),
  KeyDefinition.empty(),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '←']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke(MetaChar.LEFT)]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '→']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke(MetaChar.RIGHT)]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '⏎']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('\n')]
    ])
  }),
]
export const moreSymbols = new KeyboardDefinition('moreSymbols', [
  bracketBrace,
  floorSlashPipe,
  [
    new KeyDefinition({
      label: new KeyLabel(),
      map: new KeyMap(),
      isShadow: true
    }),
    new KeyDefinition({
      label: new KeyLabel([
        [new ZoneKey('left'), '1'],
        [new ZoneKey('center'), '2'],
        [new ZoneKey('right'), '3'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke(MetaChar.CLOSE_KEYBOARD)]
      ])
    })
  ].concat(punctuation),
  [
    new KeyDefinition({
      label: new KeyLabel(),
      map: new KeyMap()
    }),
  ].concat(control)
])

// digits-symbols child keyboard
// row 0 = 1234567890
const digits: KeyDefinition[] = [
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '1']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('1')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '2']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('2')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '3']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('3')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '4']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('4')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '5']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('5')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '6']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('6')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '7']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('7')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '8']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('8')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '9']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('9')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '0']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('0')]
    ])
  }),
]
// row 1 = - / : ; ( ) $ & @ "
const dashSlashColon: KeyDefinition[] = [
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '-']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('-')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '/']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('/')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), ':']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke(':')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), ';']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke(';')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '(']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('(')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), ')']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke(')')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '$']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('$')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '&']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('&')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '@']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('@')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '"']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('"')]
    ])
  }),
]
// row 2 = <more-symbols> [. , ? ! ' <backspace>]
// row 3 = <alphabet/close-keyboard> [<switch-keyboard> <space> <newline>]
export const digitsSymbols = new KeyboardDefinition('digitsSymbols', [
  digits,
  dashSlashColon,
  [
    new KeyDefinition({
      label: new KeyLabel(),
      map: new KeyMap(),
      isShadow: true
    }),
    new KeyDefinition({
      label: new KeyLabel([
        [new ZoneKey('left'), '#'],
        [new ZoneKey('center'), '+'],
        [new ZoneKey('right'), '='],
      ]),
      map: new KeyMap([
        [
          new AbstractTouchGesture(TouchGestureType.TOUCH), 
          new KeyboardInstance(moreSymbols, { persistence: KeyboardPersistence.Indefinite, size: KeyboardSize.Fill })]
      ])
    })
  ].concat(punctuation),
  [
    new KeyDefinition({
      label: new KeyLabel([
        [new ZoneKey('left'), 'A'],
        [new ZoneKey('center'), 'B'],
        [new ZoneKey('right'), 'C'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke(MetaChar.CLOSE_KEYBOARD)]
      ])
    })
  ].concat(control)
])

// alphabet base keyboard
// row 0 = q w e r t y u i o p
const qwertyRow: KeyDefinition[] = [
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), 'q'],
      [new ZoneKey('center', 'shift'), 'Q'],
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('q')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), 'w'],
      [new ZoneKey('center', 'shift'), 'W'],
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('w')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), 'e'],
      [new ZoneKey('center', 'shift'), 'E'],
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('e')],
      [new AbstractTouchGesture(TouchGestureType.TOUCH_HOLD), new KeyboardInstance(eDia, {
        persistence: KeyboardPersistence.Brief,
        size: KeyboardSize.Fill
      })],
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), 'r'],
      [new ZoneKey('center', 'shift'), 'R'],
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('r')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), 't'],
      [new ZoneKey('center', 'shift'), 'T'],
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('t')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), 'y'],
      [new ZoneKey('center', 'shift'), 'Y'],
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('y')],
      [new AbstractTouchGesture(TouchGestureType.TOUCH_HOLD), new KeyboardInstance(yDia, {
        persistence: KeyboardPersistence.Brief,
        size: KeyboardSize.Fill
      })],
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), 'u'],
      [new ZoneKey('center', 'shift'), 'U'],
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('u')],
      [new AbstractTouchGesture(TouchGestureType.TOUCH_HOLD), new KeyboardInstance(uDia, {
        persistence: KeyboardPersistence.Brief,
        size: KeyboardSize.Fill
      })],
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), 'i'],
      [new ZoneKey('center', 'shift'), 'I'],
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('i')],
      [new AbstractTouchGesture(TouchGestureType.TOUCH_HOLD), new KeyboardInstance(iDia, {
        persistence: KeyboardPersistence.Brief,
        size: KeyboardSize.Fill
      })],
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), 'o'],
      [new ZoneKey('center', 'shift'), 'O'],
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('o')],
      [new AbstractTouchGesture(TouchGestureType.TOUCH_HOLD), new KeyboardInstance(oDia, {
        persistence: KeyboardPersistence.Brief,
        size: KeyboardSize.Fill
      })],
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), 'p'],
      [new ZoneKey('center', 'shift'), 'P'],
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('p')]
    ])
  }),
]
// row 1 = a s d f g h j k l
const asdfRow: KeyDefinition[] = [
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), 'a'],
      [new ZoneKey('center', 'shift'), 'A'],
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('a')],
      [new AbstractTouchGesture(TouchGestureType.TOUCH_HOLD), new KeyboardInstance(aDia, {
        persistence: KeyboardPersistence.Brief,
        size: KeyboardSize.Fill
      })],
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), 's'],
      [new ZoneKey('center', 'shift'), 'S'],
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('s')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), 'd'],
      [new ZoneKey('center', 'shift'), 'D'],
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('d')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), 'f'],
      [new ZoneKey('center', 'shift'), 'F'],
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('f')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), 'g'],
      [new ZoneKey('center', 'shift'), 'G'],
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('g')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), 'h'],
      [new ZoneKey('center', 'shift'), 'H'],
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('h')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), 'j'],
      [new ZoneKey('center', 'shift'), 'J'],
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('j')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), 'k'],
      [new ZoneKey('center', 'shift'), 'K'],
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('k')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), 'l'],
      [new ZoneKey('center', 'shift'), 'L'],
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('l')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel(),
    map: new KeyMap(),
    isShadow: true
  }),
]
// row 2 = <shift> z x c v b n m <backspace>
const zxcvRow: KeyDefinition[] = [
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '⇧'],
      [new ZoneKey('center', 'capslock'), '⇪']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke(MetaChar.SHIFT)],
      [new AbstractTouchGesture(TouchGestureType.TOUCH_HOLD, undefined, undefined, false), new KeyStroke(MetaChar.CAPS_LOCK)]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), 'z'],
      [new ZoneKey('center', 'shift'), 'Z'],
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('z')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), 'x'],
      [new ZoneKey('center', 'shift'), 'X'],
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('x')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), 'c'],
      [new ZoneKey('center', 'shift'), 'C'],
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('c')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), 'v'],
      [new ZoneKey('center', 'shift'), 'V'],
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('v')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), 'b'],
      [new ZoneKey('center', 'shift'), 'B'],
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('b')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), 'n']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('n')],
      [new AbstractTouchGesture(TouchGestureType.TOUCH_HOLD), new KeyboardInstance(nDia, {
        persistence: KeyboardPersistence.Brief,
        size: KeyboardSize.Fill
      })],
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), 'm'],
      [new ZoneKey('center', 'shift'), 'M'],
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('m')]
    ])
  }),
  new KeyDefinition({
    label: new KeyLabel([
      [new ZoneKey('center'), '⌫']
    ]),
    map: new KeyMap([
      [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke(MetaChar.BACKSPACE)]
    ]),
    dimensions: new GridDimensions(2, 1)
  }),
  KeyDefinition.empty(),
]
// row 3 = <digits-symbols> [<switch-keyboard> <space> <newline>]

/**
 * English QWERTY keyboard based on common existing touch screen keyboards.
 * All digits and symbols are in separate child keyboards (other implementations would add a top row of digits).
 * Inludes diacritics on hold.
 */
export const qwertyAlphabet = new KeyboardDefinition('qwerty', [
  qwertyRow,
  asdfRow,
  zxcvRow,
  [
    new KeyDefinition({
      label: new KeyLabel([
        [new ZoneKey('left'), '1'],
        [new ZoneKey('center'), '2'],
        [new ZoneKey('right'), '3'],
      ]),
      map: new KeyMap([
        [
          new AbstractTouchGesture(TouchGestureType.TOUCH),
          new KeyboardInstance(digitsSymbols, { persistence: KeyboardPersistence.Indefinite, size: KeyboardSize.Fill })
        ]
      ])
    })
  ].concat(control)
])
