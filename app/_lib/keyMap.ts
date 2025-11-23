import { AbstractTouchGesture, TerminalTouchGestureSegmentType, TouchGestureType, typeWithoutHold } from "@lib/touchGesture"
import KeyStroke from "@lib/keyStroke"

export default class KeyMap {
  private readonly gestureToKeystroke: Map<string, KeyStroke> = new Map()

  constructor(v: [AbstractTouchGesture, KeyStroke][] = []) {
    for (let [gesture, keystroke] of v) {
      this.gestureToKeystroke.set(gesture.id, keystroke)
      console.log(`gesture.id="${gesture.id}" keystroke=${keystroke}`)
    }
  }

  getKeystroke(gesture: AbstractTouchGesture, useHoldFallback: boolean = true, useOverReturnFallback: boolean = true) {
    let keystroke = this.gestureToKeystroke.get(gesture.id)

    if (!keystroke) {
      if (useHoldFallback && gesture.isHold) {
        keystroke = this.gestureToKeystroke.get(
          new AbstractTouchGesture(typeWithoutHold(gesture.type as TouchGestureType), gesture.direction, gesture.cornerDirection).id
        )
      }
      else if (useOverReturnFallback) {
        
      }
    }

    return keystroke
  }
}