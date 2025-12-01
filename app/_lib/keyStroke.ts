import { KeyGridState } from "@context/keyGridCtx"
import { EditTextArea } from "@context/textAreaCtx"
import { KeyboardPersistence, KeyboardSize } from "./keyboardDefinition"
import { getSwitchKeyboard, switchKeyboardName } from "./keyboardDefinitions/meta/switchKeyboard"
import { ConfigureKeyBoard } from "@context/configCtx"
import { ConfigEvalMode } from "./control"

export type TypeChar = string

const metaCharStrPrefix = '<'
const metaCharStrSuffix = '>'
export enum MetaChar {
  SHIFT = '<shift>',
  CAPS_LOCK = '<caps-lock>',

  FN = '<fn>',
  CTRL = '<ctrl>',
  ALT = '<alt>',
  CMD = '<cmd>',
  ESC = '<esc>',
  WIN = '<win>',

  BACKSPACE = '<backspace>',
  
  UP = '<up>',
  RIGHT = '<right>',
  DOWN = '<down>',
  LEFT = '<left>',

  CLOSE_KEYBOARD = '<close-keyb>',
  SWITCH_KEYBOARD = '<switch-keyb>'
}

export function stringToMetaChar(s: string): MetaChar|undefined {
  if (!s.startsWith(metaCharStrPrefix) || !s.endsWith(metaCharStrSuffix)) {
    return
  }
  else {
    return Object.values(MetaChar).indexOf(s as MetaChar) !== -1 ? s as MetaChar : undefined
  }
}

export type KeyChar = TypeChar|MetaChar
export type SerializedKeyStroke = {chars: KeyChar[]}

export const cursorChar = '┃' // 0x2503

export default class KeyStroke {
  private chars: KeyChar[] = []

  constructor(...chars: KeyChar[]) {
    this.chars = this.chars.concat(chars)
  }

  toChars() {
    return [...this.chars]
  }

  static parse(s: string): KeyStroke {
    const chars: KeyChar[] = []

    for (let i=0; i<s.length; i++) {
      const mc = stringToMetaChar(s.substring(i, s.indexOf(metaCharStrSuffix, i)+1))
      if (mc !== undefined) {
        chars.push(mc)
        i += mc.length - 1
      }
      else {
        chars.push(s[i])
      }
    }

    return new KeyStroke(...chars)
  }

  toString() {
    return `KS[${this.chars.join('+')}]`
  }

  dispatch(
    textAreaEdit: EditTextArea|undefined, 
    keyboardId: string, 
    keyGridState: KeyGridState, 
    configCtx: ConfigureKeyBoard
  ) {
    let closedKeyboard = false

    for (const char of this.chars) {
      switch (char) {
        case MetaChar.LEFT:
          textAreaEdit?.moveCursor(-1)
          break
        
        case MetaChar.RIGHT:
          textAreaEdit?.moveCursor(+1)
          break

        case MetaChar.BACKSPACE:
          textAreaEdit?.deleteChars(1)
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
          if (configCtx.mode === ConfigEvalMode.Config) {
            console.log(`suppress close of current (child) key grid while in config mode`)
          }
          else {
            const deactivate = keyGridState.deactivateKeyGrid.get(keyboardId)
            if (deactivate) {
              deactivate(true)
              closedKeyboard = true
            }
          }
          break
        
        case MetaChar.SWITCH_KEYBOARD:
          if (configCtx.mode === ConfigEvalMode.Config) {
            console.info(
              `suppress auto launch of child key grid ${switchKeyboardName} `
              + `while in config mode`
            )
          }
          else {
            keyGridState.addKeyGrid(
              getSwitchKeyboard(
                keyGridState.keyboards, 
                { 
                  persistence: KeyboardPersistence.Indefinite, 
                  size: KeyboardSize.Fill
                }
              ),
              false
            )
          }
          break

        default:
          if (keyGridState.getModifierKey(MetaChar.SHIFT) || keyGridState.getModifierKey(MetaChar.CAPS_LOCK)) {
            textAreaEdit?.typeChars(char.toUpperCase())
          }
          else {
            textAreaEdit?.typeChars(char)
          }

          keyGridState.releaseEphemeralKeys()

          if (keyGridState.activeKeyboardInstanceId.current) {
            if (keyGridState.getKeyboard(keyGridState.activeKeyboardInstanceId.current)?.config.persistence === KeyboardPersistence.Brief) {
              const deactivate = keyGridState.deactivateKeyGrid.get(keyboardId)
              if (deactivate) {
                deactivate(true)
                closedKeyboard = true
              }
            }
          }
          break
      }
    }

    return { closedKeyboard }
  }

  clone() {
    return new KeyStroke(...this.chars)
  }

  equals(other: KeyStroke) {
    return this.chars.join('') === other.chars.join('')
  }

  toJSON() {
    return { chars: this.chars }
  }

  static fromJSON(o: SerializedKeyStroke) {
    return new KeyStroke(...(o.chars as KeyChar[]))
  }
}