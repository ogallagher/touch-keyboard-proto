import { KeyboardInstance, KeyboardPersistance } from "@lib/keyboardDefinition"
import { MetaChar } from "@lib/keyStroke"
import { createContext, RefObject } from "react"

export type AddKeyGrid = (keyboard: KeyboardInstance, configurable: boolean, onClose?: () => void) => void
export type DeleteKeyGrid = (keyboardInstanceId: string) => void
export type KeyboardsListListener = () => void
export type ModifierKeyListener = (v: boolean) => void
export type KeyboardExportConfig = {
  include: boolean
}

export class KeyGridState {
  private readonly _keyboards: Map<string, KeyboardInstance> = new Map()
  get keyboardIds() {
    return Array.from(this._keyboards.keys())
  }
  get keyboards() {
    return Array.from(this._keyboards.values())
  }
  getKeyboard(instanceId: string) {
    return this._keyboards.get(instanceId)
  }
  public readonly keyboardsListListeners: Map<string, KeyboardsListListener> = new Map()

  private _addKeyGrid = null as unknown as AddKeyGrid
  get addKeyGrid() { 
    const addKeyboard: AddKeyGrid = (keyboard, configurable, onClose?) => {
      this._addKeyGrid(keyboard, configurable, onClose)

      this._keyboards.set(keyboard.instanceId, keyboard)
      
      Array.from(this.keyboardsListListeners.values()).forEach(l => l())
    }

    return addKeyboard
  }
  setAddKeyGrid(v: AddKeyGrid) {
    this._addKeyGrid = v
  }

  private _deleteKeyGrid = null as unknown as DeleteKeyGrid
  get deleteKeyGrid() {
    const deleteKeyboard: DeleteKeyGrid = (keyboardInstanceId) => {
      this._deleteKeyGrid(keyboardInstanceId)
      this._keyboards.delete(keyboardInstanceId)
      Array.from(this.keyboardsListListeners.values()).forEach(l => l())
    }

    return deleteKeyboard
  }
  setDeleteKeyGrid(v: DeleteKeyGrid) {
    this._deleteKeyGrid = v
  }

  private readonly _keyboardExportConfig: Map<string, KeyboardExportConfig> = new Map()
  getKeyboardExportConfig(instanceId: string): KeyboardExportConfig {
    return this._keyboardExportConfig.get(instanceId) || {
      include: false
    }
  }
  setKeyboardExportConfig(instanceId: string, config: KeyboardExportConfig) {
    this._keyboardExportConfig.set(instanceId, config)
  }

  public readonly deactivateKeyGrid: RefObject<(closeKeyboard: boolean) => void> = {
    current: null as unknown as (closeKeyboard: boolean) => void
  }
  public readonly gridPersistance: RefObject<KeyboardPersistance> = {
    current: KeyboardPersistance.Indefinite
  }

  private readonly _modifierKeys: Map<MetaChar, boolean> = new Map([
    [MetaChar.SHIFT, false],
    [MetaChar.CAPS_LOCK, false],
    [MetaChar.FN, false],
    [MetaChar.CTRL, false],
    [MetaChar.ALT, false],
    [MetaChar.CMD, false]
  ])
  
  public readonly minMajListeners: Set<ModifierKeyListener> = new Set()
  public readonly shiftListeners: Set<ModifierKeyListener> = new Set()
  public readonly capsLockListeners: Set<ModifierKeyListener> = new Set()

  public mouseHoverKeyCell: RefObject<HTMLDivElement|null> = {
    current: null as HTMLDivElement|null
  }

  private setModifierKeys(mkeys: MetaChar[], value: boolean) {
    let updateMinMaj = false
    let updateShift = false
    let updateCapsLock = false

    mkeys.forEach(mkey => {
      this._modifierKeys.set(mkey, value)

      if (mkey === MetaChar.SHIFT) {
        updateMinMaj = true
        updateShift = true
      }
      else if (mkey === MetaChar.CAPS_LOCK) {
        updateMinMaj = true
        updateCapsLock = true
      }
    })

    if (updateMinMaj) {
      const isMaj = (this._modifierKeys.get(MetaChar.SHIFT) || this._modifierKeys.get(MetaChar.CAPS_LOCK))!
      this.minMajListeners.forEach(l => l(isMaj))
    }
    if (updateShift) {
      const isShift = this._modifierKeys.get(MetaChar.SHIFT)!
      this.shiftListeners.forEach(l => l(isShift))
    }
    if (updateCapsLock) {
      const isCapsLock = this._modifierKeys.get(MetaChar.CAPS_LOCK)!
      this.capsLockListeners.forEach(l => l(isCapsLock))
    }
  }

  pressModifierKeys(...mkeys: MetaChar[]) {
    this.setModifierKeys(mkeys, true)
  }

  releaseModifierKeys(...mkeys: MetaChar[]) {
    this.setModifierKeys(mkeys, false)
  }

  getModifierKey(mkey: MetaChar) {
    return this._modifierKeys.get(mkey)
  }

  releaseEphemeralKeys() {
    this.setModifierKeys(
      [
        MetaChar.SHIFT, MetaChar.FN, MetaChar.CTRL, MetaChar.ALT, MetaChar.CMD
      ],
      false
    )
  }
}

export const KeyGridCtx = createContext(null as KeyGridState|null)