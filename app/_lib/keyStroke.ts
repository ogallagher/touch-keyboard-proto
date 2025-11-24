import { KeyGridState } from "@context/keyGridCtx"
import { EditTextArea } from "@context/textAreaCtx"
import { KeyboardPersistance } from "./keyboardDefinition"

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
  LEFT = '<left>',

  CLOSE_KEYBOARD = '<close-keyb>'
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

  public dispatch(textAreaEdit: EditTextArea, keyGridState: KeyGridState) {
    let closedKeyboard = false

    for (const char of this.chars) {
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
          if (keyGridState.getModifierKey(MetaChar.SHIFT)) {
            keyGridState.releaseModifierKeys(MetaChar.SHIFT)
          }
          else {
            keyGridState.pressModifierKeys(MetaChar.SHIFT)
          }
          keyGridState.releaseModifierKeys(MetaChar.CAPS_LOCK)
          break
        
        case MetaChar.CAPS_LOCK:
          if (keyGridState.getModifierKey(MetaChar.CAPS_LOCK)) {
            keyGridState.releaseModifierKeys(MetaChar.CAPS_LOCK)
          }
          else {
            keyGridState.pressModifierKeys(MetaChar.CAPS_LOCK)
          }
          keyGridState.releaseModifierKeys(MetaChar.SHIFT)
          break

        case MetaChar.CLOSE_KEYBOARD:
          keyGridState.deactivateKeyGrid.current(true)
          closedKeyboard = true
          break

        default:
          if (keyGridState.getModifierKey(MetaChar.SHIFT) || keyGridState.getModifierKey(MetaChar.CAPS_LOCK)) {
            textAreaEdit.typeChars(char.toUpperCase())
          }
          else {
            textAreaEdit.typeChars(char)
          }

          keyGridState.releaseEphemeralKeys()

          if (keyGridState.gridPersistance.current === KeyboardPersistance.Brief) {
            keyGridState.deactivateKeyGrid.current(true)
            closedKeyboard = true
          }
          break
      }
    }

    return { closedKeyboard }
  }
}