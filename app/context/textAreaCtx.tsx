import { cursorChar } from "@lib/keyStroke"
import { createContext, RefObject } from "react"

export class EditTextArea {
  constructor(
    public readonly target: RefObject<HTMLTextAreaElement>,
    public readonly cursor: RefObject<number>
  ) {}

  moveCursor(delta: number) {
    if (delta === 0) return

    const newCursorPos = this.cursor.current + delta
    if (newCursorPos < 0 || newCursorPos >= this.target.current.value.length) return

    if (delta < 0) {
      this.target.current.value = (
        this.target.current.value.substring(0, newCursorPos)
        + cursorChar
        + this.target.current.value.substring(newCursorPos, this.cursor.current)
        + this.target.current.value.substring(this.cursor.current+1)
      )
    }
    else {
      this.target.current.value = (
        this.target.current.value.substring(0, this.cursor.current)
        + this.target.current.value.substring(this.cursor.current+1, newCursorPos+1)
        + cursorChar
        + this.target.current.value.substring(newCursorPos+1)
      )
    }

    this.cursor.current = newCursorPos
  }

  typeChars(chars: string) {
    // insert chars before cursor char
    this.target.current.value = (
      this.target.current.value.substring(0, this.cursor.current)
      + chars
      + this.target.current.value.substring(this.cursor.current)
    )

    this.cursor.current += chars.length
  }

  deleteChars(count: number) {
    // delete chars before cursor char
    this.target.current.value = (
      this.target.current.value.substring(0, this.cursor.current-count)
      + this.target.current.value.substring(this.cursor.current)
    )

    this.cursor.current -= count
  }
}

export const TextAreaEditCtx = createContext(null as unknown as RefObject<EditTextArea>)
