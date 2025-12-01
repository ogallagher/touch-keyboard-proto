import { ConfigEvalMode } from "@lib/control"
import GridDimensions from "@lib/gridDimensions"
import { KeyboardInstance, KeyboardPersistence, KeyboardSize, KeyIndex } from "@lib/keyboardDefinition"
import { KeyDefinition } from "@lib/keyDefinition"
import KeyStroke from "@lib/keyStroke"
import { AbstractTouchGesture } from "@lib/touchGesture"
import { createContext } from "react"

export type ClassName = string
export type ModeListener = () => void
export type LoadListener = () => void
export type SaveListener = () => void
export type ChildKeyboardConfig = {
  persistence: KeyboardPersistence
  size: KeyboardSize
}

export class ConfigureKeyBoard {
  private _mode = ConfigEvalMode.Eval
  private _keyboardInstance?: KeyboardInstance
  private _keyIndex?: KeyIndex
  private _gesture?: AbstractTouchGesture
  private _keystroke?: KeyStroke|KeyboardInstance
  private readonly modeListeners: Map<string, ModeListener> = new Map()
  private readonly loadListeners: Map<string, LoadListener> = new Map()
  private readonly saveListeners: Map<ClassName, Map<string, SaveListener>> = new Map()

  get mode() {
    return this._mode
  }

  setMode(mode: ConfigEvalMode) {
    this._mode = mode
    Array.from(this.modeListeners.values()).forEach(l => l())
  }

  addModeListener(name: string, listener: ModeListener) {
    this.modeListeners.set(name, listener)
  }

  deleteModeListener(name: string) {
    this.modeListeners.delete(name)
  }

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
    Array.from(this.loadListeners.values()).forEach(l => l())
  }

  unloadKeyboard() {
    this._keyboardInstance = undefined
    Array.from(this.loadListeners.values()).forEach(l => l())
  }

  loadKey(index: KeyIndex, gesture: AbstractTouchGesture, keystroke?: KeyStroke|KeyboardInstance) {
    this._keyIndex = index
    this._gesture = gesture
    this._keystroke = keystroke

    Array.from(this.loadListeners.values()).forEach(l => l())
  }

  unloadKey() {
    this._keyIndex = undefined
    this._gesture = undefined
    this._keystroke = undefined

    Array.from(this.loadListeners.values()).forEach(l => l())
  }

  setGridDimensions(gridDimensions: GridDimensions) {
    if (this._keyboardInstance) {
      this._keyboardInstance.keyboard.dimensions = gridDimensions
      const ls = this.saveListeners.get(GridDimensions.name)?.values()
      if (ls) {
        Array.from(ls).forEach(l => l())
      }
    }
  }

  setKey(index: KeyIndex, key: KeyDefinition) {
    if (this._keyboardInstance) {
      this._keyIndex = index
      this._keyboardInstance?.keyboard.setKey(index, key)
      const ls = this.saveListeners.get(KeyDefinition.name)?.values()
      if (ls) {
        Array.from(ls).forEach(l => l())
      }
    }
  }

  setKeyboardName(name: string) {
    if (this._keyboardInstance) {
      this._keyboardInstance.keyboard.name = name
    }
  }
}

export const ConfigCtx = createContext(null as unknown as ConfigureKeyBoard|null)
