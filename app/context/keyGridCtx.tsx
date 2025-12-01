import { KeyboardInstance, KeyboardPersistence } from "@lib/keyboardDefinition"
import { switchKeyboardName } from "@lib/keyboardDefinitions/meta/switchKeyboard"
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
  private readonly _childKeyboards: Map<string, KeyboardInstance> = new Map()

  /**
   * Get registered keyboard instance ids. Excludes child keyboards.
   */
  get keyboardIds() {
    return Array.from(this._keyboards.keys())
  }
  /**
   * Get registered keyboard instances. Excludes child keyboards.
   */
  get keyboards() {
    return Array.from(this._keyboards.values())
  }
  get childKeyboardIds() {
    return Array.from(this._childKeyboards.keys())
  }
  getKeyboard(instanceId: string) {
    return this._keyboards.get(instanceId) || this._childKeyboards.get(instanceId)
  }
  public readonly keyboardsListListeners: Map<string, KeyboardsListListener> = new Map()

  private _addKeyGrid = null as unknown as AddKeyGrid
  addKeyboard(keyboard: KeyboardInstance) {
    const isNewKeyboard = !this._childKeyboards.has(keyboard.instanceId) && !this._keyboards.has(keyboard.instanceId)
    if (isNewKeyboard) {
      if (keyboard.parentInstanceId) {
        this._childKeyboards.set(keyboard.instanceId, keyboard)
      }
      else {
        this._keyboards.set(keyboard.instanceId, keyboard)
      }

      if (keyboard.instanceId !== switchKeyboardName) {
        // add all descendant keyboards
        keyboard.getDescendants().forEach(this.addKeyboard, this)
      }

      Array.from(this.keyboardsListListeners.values()).forEach(l => l())
    }
  }
  /**
   * Render a keyboard instance as a grid and register in state/context.
   */
  get addKeyGrid() { 
    const add: AddKeyGrid = (keyboard, configurable, onClose?) => {
      this._addKeyGrid(keyboard, configurable, onClose)
      this.addKeyboard(keyboard)
    }

    return add
  }
  /**
   * Define how to render a keyboard instance.
   */
  setAddKeyGrid(v: AddKeyGrid) {
    this._addKeyGrid = v
  }

  private _deleteKeyGrid = null as unknown as DeleteKeyGrid
  public deleteKeyboard(keyboardInstanceId: string, ejectFromParent = true) {
    const keyboard = this.getKeyboard(keyboardInstanceId)
    if (!keyboard) return

    if (keyboard.parentInstanceId && ejectFromParent) {
      // eject from parent
      const parentKeyboard = this.getKeyboard(keyboard.parentInstanceId)
      parentKeyboard?.keyboard.allKeys().forEach(key => {
        key.map.entries(false, true).forEach(([gesture, sibling]) => {
          const siblingId = (sibling as KeyboardInstance).instanceId
          if (siblingId === keyboardInstanceId) {
            key.map.set(gesture, undefined)
          }
        })
      })
    }
    // delete descendants
    keyboard.getDescendants().forEach(descendant => {
      this._keyboards.delete(descendant.instanceId)
    })

    if (keyboard.parentInstanceId) {
      this._childKeyboards.delete(keyboardInstanceId)
    }
    else {
      this._keyboards.delete(keyboardInstanceId)
    }

    Array.from(this.keyboardsListListeners.values()).forEach(l => l())
  }
  get deleteKeyGrid() {
    const _delete: DeleteKeyGrid = (keyboardInstanceId) => {
      this._deleteKeyGrid(keyboardInstanceId)
      this.deleteKeyboard(keyboardInstanceId)
    }

    return _delete
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
  public readonly gridPersistence: RefObject<KeyboardPersistence> = {
    current: KeyboardPersistence.Indefinite
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