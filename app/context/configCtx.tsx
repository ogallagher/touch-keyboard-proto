import { ConfigEvalMode } from "@lib/control"
import GridDimensions from "@lib/gridDimensions"
import { KeyboardInstance, KeyboardPersistence, KeyboardSize, KeyIndex } from "@lib/keyboardDefinition"
import { KeyDefinition } from "@lib/keyDefinition"
import KeyStroke from "@lib/keyStroke"
import { AbstractTouchGesture } from "@lib/touchGesture"
import { createContext } from "react"

export type SaveKey = 'GridDimensions'|'KeyDefinition'|'KeyDefinition.dimensions'|'KeyIndex'|'KeyGridViewportHeight'
export type ModeListener = () => void
export type LoadListener = () => void
export type SaveListener = (kidx?: KeyIndex) => void
export type ChildKeyboardConfig = {
  persistence: KeyboardPersistence
  size: KeyboardSize
}

export class ConfigureKeyBoard {
  private _mode = ConfigEvalMode.Eval
  private _keyboardInstance?: KeyboardInstance
  private _gridViewportHeight?: number
  private _keyIndex?: KeyIndex
  private _gesture?: AbstractTouchGesture
  private _keystroke?: KeyStroke|KeyboardInstance
  private _isShadow?: boolean
  private _keyDimensions?: GridDimensions
  private readonly modeListeners: Map<string, ModeListener> = new Map()
  private readonly loadListeners: Map<string, LoadListener> = new Map()
  private readonly saveListeners: Map<SaveKey, Map<string, SaveListener>> = new Map()

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

  get gridViewportHeight() { return this._gridViewportHeight }

  get keyIndex() { return this._keyIndex }

  get gesture() { return this._gesture }

  get keystroke() {
    if (this._keystroke instanceof KeyStroke) {
      return this._keystroke
    }
  }

  get isShadow() { return this._isShadow }

  get keyDimensions() { return this._keyDimensions }

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

  addSaveListener(name: string, attributeType: SaveKey, listener: SaveListener) {
    const attrListeners = this.saveListeners.get(attributeType) || new Map()
    attrListeners.set(name, listener)
    this.saveListeners.set(attributeType, attrListeners)
  }

  deleteSaveListener(name: string, attributeTye: SaveKey) {
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

  loadKey(index: KeyIndex, gesture: AbstractTouchGesture, keystroke?: KeyStroke|KeyboardInstance, isShadow?: boolean, keyDimensions?: GridDimensions) {
    this._keyIndex = index
    this._gesture = gesture
    this._keystroke = keystroke
    this._isShadow = isShadow
    this._keyDimensions = keyDimensions

    Array.from(this.loadListeners.values()).forEach(l => l())
  }

  unloadKey() {
    this._keyIndex = undefined
    this._gesture = undefined
    this._keystroke = undefined
    this._isShadow = undefined

    Array.from(this.loadListeners.values()).forEach(l => l())
  }

  setGridDimensions(gridDimensions: GridDimensions) {
    if (this._keyboardInstance) {
      this._keyboardInstance.keyboard.dimensions = gridDimensions
      const ls = this.saveListeners.get('GridDimensions')?.values()
      if (ls) {
        Array.from(ls).forEach(l => l())
      }
    }
  }

  setGridViewportHeight(viewportHeight?: number) {
    if (this._keyboardInstance) {
      this._gridViewportHeight = viewportHeight
      const ls = this.saveListeners.get('KeyGridViewportHeight')?.values()
      if (ls) {
        Array.from(ls).forEach(l => l())
      }
    }
  }

  setKey(index: KeyIndex, key: KeyDefinition) {
    if (this._keyboardInstance) {
      this._keyIndex = index
      this._keystroke = this._gesture ? key.map.getKeys(this._gesture, true, true) : undefined
      this._isShadow = key.isShadow
      const { updateDimensions, shadowUpdateKeys } = this._keyboardInstance.keyboard.setKey(index, key)

      const lsKeyDef = this.saveListeners.get('KeyDefinition')?.values()
      if (lsKeyDef) {
        Array.from(lsKeyDef).forEach(l => l())
      }

      if (updateDimensions) {
        const lsKeyDim = this.saveListeners.get('KeyDefinition.dimensions')?.values()
        if (lsKeyDim) {
          Array.from(lsKeyDim).forEach(l => {
            // bridge key
            l(index)

            // shadow update keys
            for (const shadowUpdateKey of shadowUpdateKeys) {
              l(shadowUpdateKey)
            }
          })
        }
      }
    }
  }

  moveKey(index: KeyIndex, newIndex: KeyIndex) {
    if (this._keyboardInstance) {
      this._keyIndex = newIndex
      const { shadowUpdateKeys } = this._keyboardInstance.keyboard.moveKey(index, newIndex)
      const ls = this.saveListeners.get('KeyIndex')?.values()
      if (ls) {
        Array.from(ls).forEach(l => {
          // prev location key
          l(index)

          // new location key
          l(newIndex)

          // shadow update keys
          for (const shadowUpdateKey of shadowUpdateKeys) {
            l(shadowUpdateKey)
          }
        })
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
