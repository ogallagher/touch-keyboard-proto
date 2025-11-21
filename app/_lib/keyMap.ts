import { AbstractTouchGesture } from "@lib/touchGesture"
import KeyStroke from "@lib/keyStroke"

export default class KeyMap {
  private readonly gestureToKeystroke: Map<string, KeyStroke> = new Map()

  constructor(v: [AbstractTouchGesture, KeyStroke][] = []) {
    for (let [gesture, keystroke] of v) {
      this.gestureToKeystroke.set(gesture.id, keystroke)
      console.log(`gesture.id="${gesture.id}" keystroke=${keystroke}`)
    }
  }

  getKeystroke(gesture: AbstractTouchGesture) {
    return this.gestureToKeystroke.get(gesture.id)
  }
}