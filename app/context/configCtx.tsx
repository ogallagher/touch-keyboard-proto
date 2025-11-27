import { ConfigEvalMode } from "@lib/control"
import GridDimensions from "@lib/gridDimensions"
import { KeyboardInstance, KeyIndex } from "@lib/keyboardDefinition"
import { KeyDefinition } from "@lib/keyDefinition"
import KeyLabel from "@lib/keyLabel"
import KeyStroke from "@lib/keyStroke"
import { AbstractTouchGesture } from "@lib/touchGesture"
import { createContext } from "react"

export type ClassName = string
export type LoadListener = () => void
export type SaveListener = () => void

export function configListenerName(className: string) {
  return `${className}${new Date().toISOString()}`
}

export class ConfigureKeyBoard {
  public mode = ConfigEvalMode.Eval
  private _keyboardInstance?: KeyboardInstance
  private _keyIndex?: KeyIndex
  private _gesture?: AbstractTouchGesture
  private _keystroke?: KeyStroke|KeyboardInstance
  private readonly loadListeners: Map<string, LoadListener> = new Map()
  private readonly saveListeners: Map<ClassName, Map<string, SaveListener>> = new Map()

  get keyboardInstance() { return this._keyboardInstance }

  get keyIndex() { return this._keyIndex }

  get gesture() { return this._gesture }

  get keystroke() {
    if (this._keystroke instanceof KeyStroke) {
      return this._keystroke
    }
  }

  getKeyDefinition(keyIndex: KeyIndex) {
    return this._keyboardInstance?.keyboard.getKey(keyIndex.row, keyIndex.col)
  }

  get childKeyboardInstance() {
    if (this._keystroke instanceof KeyboardInstance) {
      return this._keystroke
    }
  }

  addLoadListener(name: string, listener: LoadListener) {
    this.loadListeners.set(name, listener)
  }

  deleteLoadListener(name: string) {
    this.loadListeners.delete(name)
  }

  addSaveListener(name: string, attributeType: ClassName, listener: SaveListener) {
    const attrListeners = this.saveListeners.get(attributeType) || new Map()
    attrListeners.set(name, listener)
    this.saveListeners.set(attributeType, attrListeners)
  }

  deleteSaveListener(name: string, attributeTye: ClassName) {
    this.saveListeners.get(attributeTye)?.delete(name)
  }

  loadKeyboard(keyboardInstance: KeyboardInstance) {
    this._keyboardInstance = keyboardInstance
    this.loadListeners.values().forEach(l => l())
  }

  loadKey(index: KeyIndex, gesture: AbstractTouchGesture, keystroke?: KeyStroke|KeyboardInstance) {
    this._keyIndex = index
    this._gesture = gesture
    this._keystroke = keystroke
    this.loadListeners.values().forEach(l => l())
  }

  setGridDimensions(gridDimensions: GridDimensions) {
    if (this._keyboardInstance) {
      this._keyboardInstance.keyboard.dimensions = gridDimensions
      this.saveListeners.get(GridDimensions.name)?.values().forEach(l => l())
    }
  }

  setKey(index: KeyIndex, key: KeyDefinition) {
    if (this._keyboardInstance) {
      this._keyIndex = index
      this._keyboardInstance?.keyboard.setKey(index, key)
      this.saveListeners.get(KeyDefinition.name)?.values().forEach(l => l())
    }
  }
}

export const ConfigCtx = createContext(null as unknown as ConfigureKeyBoard)
