import { ConfigEvalMode } from "@lib/control"
import { KeyboardInstance, KeyIndex } from "@lib/keyboardDefinition"
import KeyStroke from "@lib/keyStroke"
import TouchGesture from "@lib/touchGesture"
import { createContext } from "react"

export type LoadListener = () => void

export class ConfigureKeyBoard {
  public mode = ConfigEvalMode.Eval
  private _keyboardInstance?: KeyboardInstance
  private _keyIndex?: KeyIndex
  private _gesture?: TouchGesture
  private _keystroke?: KeyStroke|KeyboardInstance
  private readonly loadListeners: Map<string, LoadListener> = new Map()

  get keyboardInstance() { return this._keyboardInstance }

  get keyIndex() { return this._keyIndex }

  get gesture() { return this._gesture }

  get keystroke() {
    if (this._keystroke instanceof KeyStroke) {
      return this._keystroke
    }
  }

  get childKeyboardInstance() {
    if (this._keystroke instanceof KeyboardInstance) {
      return this._keystroke
    }
  }

  loadKeyboard(keyboardInstance: KeyboardInstance) {
    this._keyboardInstance = keyboardInstance
    this.loadListeners.forEach(l => l())
  }

  loadKey(index: KeyIndex, gesture: TouchGesture, keystroke?: KeyStroke|KeyboardInstance) {
    this._keyIndex = index
    this._gesture = gesture
    this._keystroke = keystroke
    this.loadListeners.forEach(l => l())
  }

  addLoadListener(name: string, listener: LoadListener) {
    this.loadListeners.set(name, listener)
  }

  save() {
    // TODO call saveListeners?
  }
}

export const ConfigCtx = createContext(null as unknown as ConfigureKeyBoard)
