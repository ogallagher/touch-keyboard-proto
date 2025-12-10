import { cursorChar } from "@lib/keyStroke"
import { createContext } from "react"

export type LockListener = () => void

export class EditTextArea {
  private _target: HTMLTextAreaElement|undefined
  private _cursor: number = 0
  private _locked: boolean = true
  private lockListeners: Map<string, LockListener> = new Map()

  constructor() {
    this.reset()
  }

  get target() {
    return this._target
  }
  setTarget(t: HTMLTextAreaElement) {
    this._target = t
  }

  get cursor() {
    return this._cursor
  }

  moveCursor(delta: number) {
    if (!this._target || delta === 0 || !this._locked) return

    const newCursorPos = this._cursor + delta
    if (newCursorPos < 0 || newCursorPos >= this._target.value.length) return

    if (delta < 0) {
      this._target.value = (
        this._target.value.substring(0, newCursorPos)
        + cursorChar
        + this._target.value.substring(newCursorPos, this._cursor)
        + this._target.value.substring(this._cursor+1)
      )
    }
    else {
      this._target.value = (
        this._target.value.substring(0, this._cursor)
        + this._target.value.substring(this._cursor+1, newCursorPos+1)
        + cursorChar
        + this._target.value.substring(newCursorPos+1)
      )
    }

    this._cursor = newCursorPos
  }

  typeChars(chars: string) {
    if (!this._target || !this._locked) return

    // insert chars before cursor char
    this._target.value = (
      this._target.value.substring(0, this._cursor)
      + chars
      + this._target.value.substring(this._cursor)
    )

    this._cursor += chars.length
  }

  deleteChars(count: number) {
    if (!this._target || this._cursor === 0 || !this._locked) return

    // delete chars before cursor char
    this._target.value = (
      this._target.value.substring(0, this._cursor-count)
      + this._target.value.substring(this._cursor)
    )

    this._cursor -= count
  }

  reset() {
    this._cursor = 0

    if (this._target) {
      this._target.value = cursorChar
      this._target.focus()
    }
  }

  addLockListener(name: string, listener: LockListener) {
    this.lockListeners.set(name, listener)
  }

  deleteLockListener(name: string) {
    this.lockListeners.delete(name)
  }

  get locked() { return this._locked }

  setLocked(locked: boolean) {
    this._locked = locked

    if (this._target) {
      if (this._locked && this._target.value.codePointAt(this._cursor) !== cursorChar.codePointAt(0)) {
        // show custom cursor and move to end
        this._cursor = this._target.value.length
        this._target.value = this._target.value + cursorChar
      }
      else if (this._target.value.codePointAt(this._cursor) === cursorChar.codePointAt(0)) {
        // hide custom cursor
        this._target.value = (
          this._target.value.substring(0, this._cursor)
          + this._target.value.substring(this._cursor+1)
        )
      }
    }
    
    Array.from(this.lockListeners.values()).forEach(l => l())
  }
}

export const TextAreaEditCtx = createContext(null as unknown as EditTextArea)
