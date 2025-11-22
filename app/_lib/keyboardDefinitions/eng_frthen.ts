import KeyboardDefinition from "@lib/keyboardDefinition"
import KeyLabel from "@lib/keyLabel"
import KeyMap from "@lib/keyMap"
import KeyStroke, { MetaChar } from "@lib/keyStroke"
import { Direction } from "@lib/orientation"
import { AbstractTouchGesture, TouchGestureType } from "@lib/touchGesture"

export const frthenKeyboard = new KeyboardDefinition([
  // row 1 = f r t
  [
    {
      label: new KeyLabel({ 
        center: 'f',
        down: 'v'
      }),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('f')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.DOWN), new KeyStroke('v')]
      ])
    },
    {
      label: new KeyLabel({
        center: 'r',
        left: 'y',
        down: 'w',
        right: 're'
      }),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('r')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.LEFT), new KeyStroke('y')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.DOWN), new KeyStroke('w')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.RIGHT), new KeyStroke('r', 'e')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE_HOLD, Direction.RIGHT), new KeyStroke("'", 'r', 'e')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_RETURN_SWIPE, Direction.RIGHT), new KeyStroke('e', 'r')]
      ])
    },
    {
      label: new KeyLabel({
        center: 't',
        left: 'd',
        down: 'th',
        right: 'j',
        up: 'to'
      }),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('t')],
        [new AbstractTouchGesture(TouchGestureType.TOUCH_HOLD), new KeyStroke("'", 't')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.LEFT), new KeyStroke('d')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE_HOLD, Direction.LEFT), new KeyStroke("'", 'd')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.DOWN), new KeyStroke('th')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.RIGHT), new KeyStroke('j')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.UP), new KeyStroke('t', 'o')]
      ])
    }
  ],
  // row 2 = h e n
  [ 
    {
      label: new KeyLabel({
        center: 'h',
        left: 'hi',
        right: 'ha',
        up: 'he'
      }),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('h')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.LEFT), new KeyStroke('h', 'i')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.RIGHT), new KeyStroke('h', 'a')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.UP), new KeyStroke('h', 'e')]
      ])
    },
    {
      label: new KeyLabel({
        center: 'e',
        left: 'i',
        down: 'u',
        right: 'a',
        up: 'o'
      }),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('e')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.LEFT), new KeyStroke('i')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.DOWN), new KeyStroke('u')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.RIGHT), new KeyStroke('a')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.UP), new KeyStroke('o')]
      ])
    },
    {
      label: new KeyLabel({
        center: 'l\nn',
        left: 'an',
        right: 'in',
        down: 'ng',
        up: 'nd'
      }),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('n')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.LEFT), new KeyStroke('a', 'n')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.DOWN), new KeyStroke('n', 'g')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.RIGHT), new KeyStroke('i', 'n')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.UP), new KeyStroke('n', 'd')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_RETURN_SWIPE, Direction.UP), new KeyStroke('l')]
      ])
    }
  ],
  // row 3 = s k p
  [
    {
      label: new KeyLabel({
        center: 's',
        left: 'z',
        right: 'c',
        up: 'sh'
      }),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('s')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.LEFT), new KeyStroke('z')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.RIGHT), new KeyStroke('c')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.UP), new KeyStroke('s', 'h')]
      ])
    },
    {
      label: new KeyLabel({
        center: 'k',
        down: 'x',
        right: 'q',
        up: 'g',
        left: '⌫'
      }),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('k')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.DOWN), new KeyStroke('x')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.RIGHT), new KeyStroke('q')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.UP), new KeyStroke('g')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.LEFT), new KeyStroke(MetaChar.BACKSPACE)]
      ])
    },
    {
      label: new KeyLabel({
        center: 'p',
        left: 'm',
        up: 'b'
      }),
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
      label: new KeyLabel({
        center: "'",
        left: '(',
        right: ')',
        up: '"',
        down: '⇪'
      }),
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
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE_HOLD, Direction.DOWN), new KeyStroke(MetaChar.CAPS_LOCK)],
      ])
    },
    {
      label: new KeyLabel({
        center: '[ ]',
        down: '↩',
        left: '←',
        right: '→',
        up: '↦'
      }),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke(' ')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.DOWN), new KeyStroke('\n')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.RIGHT), new KeyStroke(MetaChar.RIGHT)],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.LEFT), new KeyStroke(MetaChar.LEFT)],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.UP), new KeyStroke('\t')]
      ])
    },
    {
      label: new KeyLabel({
        center: '.',
        left: '?',
        up: '!',
        right: ',',
        down: ':'
      }),
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
