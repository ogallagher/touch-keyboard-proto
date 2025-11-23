import { AbstractTouchGesture, TouchGestureType, typeWithoutHold, typeWithoutOverReturn } from "@lib/touchGesture"
import KeyStroke from "@lib/keyStroke"

export default class KeyMap {
  private readonly gestures: Map<string, AbstractTouchGesture> = new Map()
  private readonly gestureToKeystroke: Map<string, KeyStroke> = new Map()

  constructor(v: [AbstractTouchGesture, KeyStroke][] = []) {
    for (let [gesture, keystroke] of v) {
      this.gestures.set(gesture.id, gesture)
      this.gestureToKeystroke.set(gesture.id, keystroke)
    }
  }

  getKeystroke(gesture: AbstractTouchGesture, useHoldFallback: boolean = true, useOverReturnFallback: boolean = true) {
    let keystroke = this.gestureToKeystroke.get(gesture.id)

    if (!keystroke) {
      if (useHoldFallback && gesture.isHold) {
        keystroke = this.gestureToKeystroke.get(
          new AbstractTouchGesture(
            typeWithoutHold(gesture.type as TouchGestureType), 
            gesture.direction, 
            gesture.cornerDirection,
            gesture.chainOnHold
          ).id
        )
      }
      else if (useOverReturnFallback && gesture.isOverReturn) {
        keystroke = this.gestureToKeystroke.get(
          new AbstractTouchGesture(
            typeWithoutOverReturn(gesture.type as TouchGestureType), 
            gesture.direction, 
            gesture.cornerDirection,
            gesture.chainOnHold
          ).id
        )
      }
    }

    return keystroke
  }

  getAbstractGesture(gesture: AbstractTouchGesture, useHoldFallback: boolean = true, useOverReturnFallback: boolean = true) {
    let abstractGesture = this.gestures.get(gesture.id)

    if (!abstractGesture) {
      if (useHoldFallback && gesture.isHold) {
        abstractGesture = this.gestures.get(
          new AbstractTouchGesture(
            typeWithoutHold(gesture.type as TouchGestureType), 
            gesture.direction, 
            gesture.cornerDirection,
            gesture.chainOnHold
          ).id
        )
      }
      else if (useOverReturnFallback && gesture.isOverReturn) {
        abstractGesture = this.gestures.get(
          new AbstractTouchGesture(
            typeWithoutOverReturn(gesture.type as TouchGestureType), 
            gesture.direction, 
            gesture.cornerDirection,
            gesture.chainOnHold
          ).id
        )
      }
    }

    return abstractGesture
  }
}