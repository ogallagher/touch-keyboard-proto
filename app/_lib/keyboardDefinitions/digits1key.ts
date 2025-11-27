import KeyboardDefinition from "@lib/keyboardDefinition"
import { KeyDefinition } from "@lib/keyDefinition"
import KeyLabel, { ZoneKey } from "@lib/keyLabel"
import KeyMap from "@lib/keyMap"
import KeyStroke from "@lib/keyStroke"
import { Cardinal, Diagonal, Direction } from "@lib/orientation"
import { AbstractTouchGesture, InitGestureSegmentType, TouchGestureType } from "@lib/touchGesture"

export const digits1key = new KeyboardDefinition('digits1key', [
  [
    new KeyDefinition({
      label: new KeyLabel([
        [new ZoneKey('center'), '0 5'],
        [new ZoneKey('center', InitGestureSegmentType.TOUCH), '5'],
        [new ZoneKey('center', InitGestureSegmentType.CARDINAL_SWIPE, Cardinal.UP), '.'],
        [new ZoneKey('center', InitGestureSegmentType.CARDINAL_SWIPE, Cardinal.LEFT), '-'],
        [new ZoneKey('center', InitGestureSegmentType.CARDINAL_SWIPE, Cardinal.RIGHT), '+'],
        [new ZoneKey('center', InitGestureSegmentType.DIAGONAL_SWIPE, Diagonal.UPRIGHT), '*'],
        [new ZoneKey('center', InitGestureSegmentType.DIAGONAL_SWIPE, Diagonal.DOWNRIGHT), '/'],
        
        [new ZoneKey('upleft'), '1'],
        [new ZoneKey('up'), '2'],
        [new ZoneKey('upright'), '3'],

        [new ZoneKey('left'), '4'],
        [new ZoneKey('left', InitGestureSegmentType.CARDINAL_SWIPE, Cardinal.RIGHT), '='],

        [new ZoneKey('right'), '6'],
        [new ZoneKey('downleft'), '7'],
        [new ZoneKey('down'), '8'],
        [new ZoneKey('downright'), '9'],
      ]),
      map: new KeyMap([
        [new AbstractTouchGesture(TouchGestureType.TOUCH), new KeyStroke('0')],
        [new AbstractTouchGesture(TouchGestureType.DIAGONAL_SWIPE, Direction.UPLEFT), new KeyStroke('1')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.UP), new KeyStroke('2')],
        [new AbstractTouchGesture(TouchGestureType.DIAGONAL_SWIPE, Direction.UPRIGHT), new KeyStroke('3')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.LEFT), new KeyStroke('4')],
        [new AbstractTouchGesture(TouchGestureType.TOUCH_HOLD, undefined, undefined, false), new KeyStroke('5')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.RIGHT), new KeyStroke('6')],
        [new AbstractTouchGesture(TouchGestureType.DIAGONAL_SWIPE, Direction.DOWNLEFT), new KeyStroke('7')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_SWIPE, Direction.DOWN), new KeyStroke('8')],
        [new AbstractTouchGesture(TouchGestureType.DIAGONAL_SWIPE, Direction.DOWNRIGHT), new KeyStroke('9')],

        [new AbstractTouchGesture(TouchGestureType.CARDINAL_RETURN_SWIPE, Direction.UP), new KeyStroke('.')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_RETURN_SWIPE, Direction.LEFT), new KeyStroke('-')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_RETURN_SWIPE, Direction.RIGHT), new KeyStroke('+')],
        [new AbstractTouchGesture(TouchGestureType.DIAGONAL_RETURN_SWIPE, Direction.UPRIGHT), new KeyStroke('*')],
        [new AbstractTouchGesture(TouchGestureType.DIAGONAL_RETURN_SWIPE, Direction.DOWNRIGHT), new KeyStroke('/')],
        [new AbstractTouchGesture(TouchGestureType.CARDINAL_RETURN_OVER_SWIPE, Direction.RIGHT), new KeyStroke('=')],
      ])
    })
  ]
])
