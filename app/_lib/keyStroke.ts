import { KeyGridState } from "@context/keyGridCtx"
import { EditTextArea } from "@context/textAreaCtx"

export type TypeChar = string

export enum MetaChar {
  SHIFT = '<shift>',
  CAPS_LOCK = '<caps-lock>',

  FN = '<fn>',
  CTRL = '<ctrl>',
  ALT = '<alt>',
  CMD = '<cmd>',
  ESC = '<esc>',

  BACKSPACE = '<backspace>',
  
  UP = '<up>',
  RIGHT = '<right>',
  DOWN = '<down>',
  LEFT = '<left>'
}

export type KeyChar = TypeChar|MetaChar

export const cursorChar = '┃' // 0x2503

export default class KeyStroke {
  private chars: KeyChar[] = []

  public constructor(...chars: KeyChar[]) {
    this.chars = this.chars.concat(chars)
  }

  public toString() {
    return `KS[${this.chars.join('+')}]`
  }

  public dispatch(textAreaEdit: EditTextArea, keyState: KeyGridState) {
    for (let char of this.chars) {
      switch (char) {
        case MetaChar.LEFT:
          textAreaEdit.moveCursor(-1)
          break
        
        case MetaChar.RIGHT:
          textAreaEdit.moveCursor(+1)
          break

        case MetaChar.BACKSPACE:
          textAreaEdit.deleteChars(1)
          break

        case MetaChar.SHIFT:
          if (keyState.getModifierKey(MetaChar.SHIFT)) {
            keyState.releaseModifierKeys(MetaChar.SHIFT)
          }
          else {
            keyState.pressModifierKeys(MetaChar.SHIFT)
          }
          keyState.releaseModifierKeys(MetaChar.CAPS_LOCK)
          break
        
        case MetaChar.CAPS_LOCK:
          if (keyState.getModifierKey(MetaChar.CAPS_LOCK)) {
            keyState.releaseModifierKeys(MetaChar.CAPS_LOCK)
          }
          else {
            keyState.pressModifierKeys(MetaChar.CAPS_LOCK)
          }
          keyState.releaseModifierKeys(MetaChar.SHIFT)
          break

        default:
          if (keyState.getModifierKey(MetaChar.SHIFT) || keyState.getModifierKey(MetaChar.CAPS_LOCK)) {
            textAreaEdit.typeChars(char.toUpperCase())
          }
          else {
            textAreaEdit.typeChars(char)
          }
          keyState.releaseEphemeralKeys()
          break
      }
    }
  }
}