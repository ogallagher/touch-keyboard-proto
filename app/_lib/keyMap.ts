import { AbstractTouchGesture, TouchGestureType, typeWithoutHold, typeWithoutOverReturn } from "@lib/touchGesture"
import KeyStroke from "@lib/keyStroke"
import { ChildKeyboardDefinition } from "./keyboardDefinition"

export default class KeyMap {
  private readonly gestures: Map<string, AbstractTouchGesture> = new Map()
  private readonly gestureToKeystroke: Map<string, KeyStroke> = new Map()
  private readonly gestureToKeyboard: Map<string, ChildKeyboardDefinition> = new Map()

  constructor(v: [AbstractTouchGesture, KeyStroke|ChildKeyboardDefinition][] = []) {
    for (let [gesture, keys] of v) {
      this.set(gesture, keys)
    }
  }

  entries() {
    const keystrokes: [AbstractTouchGesture, KeyStroke|ChildKeyboardDefinition][] = (
      [...this.gestureToKeystroke.entries()]
      .map(([gid, keystroke]) => [this.gestures.get(gid)!, keystroke])
    )
    const keyboards: [AbstractTouchGesture, KeyStroke|ChildKeyboardDefinition][] = (
      [...this.gestureToKeyboard.entries()]
      .map(([gid, keyboard]) => [this.gestures.get(gid)!, keyboard])
    )

    return keystrokes.concat(keyboards)
  }

  set(gesture: AbstractTouchGesture, keys: KeyStroke|ChildKeyboardDefinition) {
    this.gestures.set(gesture.id, gesture)
    if (keys instanceof KeyStroke) {
      this.gestureToKeystroke.set(gesture.id, keys)
    }
    else {
      this.gestureToKeyboard.set(gesture.id, keys)
    }
  }

  getKeys(
    gesture: AbstractTouchGesture, 
    useHoldFallback: boolean, 
    useOverReturnFallback: boolean
  ) {
    const maps = [this.gestureToKeystroke, this.gestureToKeyboard]
    let keys: KeyStroke|ChildKeyboardDefinition|undefined

    function* gestures() {
      yield gesture

      if (useHoldFallback) {
        yield new AbstractTouchGesture(
          typeWithoutHold(gesture.type as TouchGestureType), 
          gesture.direction, 
          gesture.cornerDirection,
          gesture.chainOnHold
        )
      }

      if (useOverReturnFallback) {
        yield new AbstractTouchGesture(
          typeWithoutOverReturn(gesture.type as TouchGestureType), 
          gesture.direction, 
          gesture.cornerDirection,
          gesture.chainOnHold
        )
      }
    }

    for (let _gesture of gestures()) {
      for (let map of maps) {
        keys = map.get(_gesture.id)
        if (keys) return keys
      }
    }

    return keys
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