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

  public dispatch(textAreaEdit: EditTextArea) {
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

        default:
          textAreaEdit.typeChars(char)
          break
      }
      
    }
  }
}