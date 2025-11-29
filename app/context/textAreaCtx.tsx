import { cursorChar } from "@lib/keyStroke"
import { createContext } from "react"

export class EditTextArea {
  private _target: HTMLTextAreaElement|undefined

  private _cursor: number = 0

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
    if (delta === 0) return
    if (!this._target) return

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
    if (!this._target) return

    // insert chars before cursor char
    this._target.value = (
      this._target.value.substring(0, this._cursor)
      + chars
      + this._target.value.substring(this._cursor)
    )

    this._cursor += chars.length
  }

  deleteChars(count: number) {
    if (!this._target || this._cursor === 0) return

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
}

export const TextAreaEditCtx = createContext(null as unknown as EditTextArea)
