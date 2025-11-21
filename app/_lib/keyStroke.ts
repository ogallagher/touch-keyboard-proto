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

export default class KeyStroke {
  private chars: KeyChar[] = []

  public constructor(...chars: KeyChar[]) {
    this.chars = this.chars.concat(chars)
  }

  public toString() {
    return `KS[${this.chars.join('+')}]`
  }

  public dispatch(target: HTMLTextAreaElement|HTMLInputElement) {
    for (let char of this.chars) {
      target.value += char
    }
  }
}