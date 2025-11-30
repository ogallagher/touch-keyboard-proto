import { AbstractTouchGesture, SerializedAbstractGesture, TouchGestureType, typeWithoutHold, typeWithoutOverReturn } from "@lib/touchGesture"
import KeyStroke, { SerializedKeyStroke } from "@lib/keyStroke"
import { KeyboardInstance, SerializedKeyboardInstance } from "./keyboardDefinition"

export type SerializedKeyMap = {values: [SerializedAbstractGesture, SerializedKeyStroke|SerializedKeyboardInstance][]}

export enum KeyMapValuetype {
  Keystroke = 'keystroke',
  Keyboard = 'keyboard'
}

export default class KeyMap {
  private readonly gestures: Map<string, AbstractTouchGesture> = new Map()
  private readonly gestureToKeystroke: Map<string, KeyStroke> = new Map()
  private readonly gestureToKeyboard: Map<string, KeyboardInstance> = new Map()

  constructor(v: [AbstractTouchGesture, KeyStroke|KeyboardInstance][] = []) {
    for (const [gesture, keys] of v) {
      this.set(gesture, keys)
    }
  }

  entries() {
    const keystrokes: [AbstractTouchGesture, KeyStroke|KeyboardInstance][] = (
      Array.from(this.gestureToKeystroke.entries())
      .map(([gid, keystroke]) => [this.gestures.get(gid)!, keystroke])
    )
    const keyboards: [AbstractTouchGesture, KeyStroke|KeyboardInstance][] = (
      Array.from(this.gestureToKeyboard.entries())
      .map(([gid, keyboard]) => [this.gestures.get(gid)!, keyboard])
    )

    return keystrokes.concat(keyboards)
  }

  clone(deep: boolean = true) {
    return new KeyMap(this.entries().map(([gesture, keys]) => {
      return (
        deep
        ? [gesture.clone(), keys.clone()]
        : [gesture, keys]
      )
    }))
  }

  /**
   * @param gesture Touch gesture input.
   * @param keys Keystroke or child keyboard output. If not defined, output for this gesture is likewise not defined.
   */
  set(gesture: AbstractTouchGesture, keys: KeyStroke|KeyboardInstance|undefined) {
    this.gestures.set(gesture.id, gesture)
    if (keys instanceof KeyStroke) {
      this.gestureToKeystroke.set(gesture.id, keys)
    }
    else if (keys !== undefined) {
      this.gestureToKeyboard.set(gesture.id, keys)
    }
    else {
      this.gestureToKeystroke.delete(gesture.id)
      this.gestureToKeyboard.delete(gesture.id)
    }
  }

  getKeys(
    gesture: AbstractTouchGesture, 
    useHoldFallback: boolean, 
    useOverReturnFallback: boolean
  ) {
    const maps = [this.gestureToKeystroke, this.gestureToKeyboard]
    let keys: KeyStroke|KeyboardInstance|undefined

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

    const _gestures = gestures()
    let res: IteratorResult<AbstractTouchGesture, void>
    do {
      res = _gestures.next()
      if (res.done) break

      for (const map of maps) {
        keys = map.get(res.value.id)
        if (keys) return keys
      }
    } while (true)

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

  equals(other: KeyMap) {
    if (this.gestures.size !== other.gestures.size) {
      return false
    }

    const gestureIds = new Set(this.gestures.keys())
    Array.from(other.gestures.keys()).forEach(gi => gestureIds.add(gi))

    for (const gestureId of Array.from(gestureIds)) {
      const gesture = this.gestures.get(gestureId) || other.gestures.get(gestureId)
      const keys = this.getKeys(gesture!, false, false)
      const otherKeys = other.getKeys(gesture!, false, false)
      
      if (keys === undefined) {
        if (otherKeys !== undefined) return false
      }
      else if (keys instanceof KeyStroke) {
        if (!(otherKeys instanceof KeyStroke) || !keys.equals(otherKeys)) return false
      }
      else if (keys instanceof KeyboardInstance) {
        if (!(otherKeys instanceof KeyboardInstance) || !keys.equals(otherKeys, true)) return false
      }
    }

    return true
  }

  toJSON() {
    return {
      values: this.entries()
    }
  }

  static fromJSON(o: SerializedKeyMap) {
    return new KeyMap(
      o.values.map(([gesture, keys]) => [
        AbstractTouchGesture.fromJSON(gesture), 
        (
          'chars' in keys 
          ? KeyStroke.fromJSON(keys) 
          : KeyboardInstance.fromJSON(keys)
        )
      ])
    )
  }
}