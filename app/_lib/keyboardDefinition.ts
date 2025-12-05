import GridDimensions from "@lib/gridDimensions"
import { KeyAttributes, KeyDefinition, SerializedKeyDefinition } from "@lib/keyDefinition"

export enum KeyboardPersistence {
  /**
   * Close after any keystroke.
   */
  Brief = 'brief',
  /**
   * Remain open until close-keyboard keystroke.
   */
  Indefinite = 'indefinite'
}

export enum KeyboardSize {
  /**
   * Display the child keyboard within the parent key that opened it.
   */
  Embed = 'embed',
  /**
   * Display the child keyboard across the whole parent grid.
   */
  Fill = 'fill'
}

export interface KeyIndex { row: number, col: number }
export type KeyOverride = KeyIndex & {
  key: KeyAttributes
}
export type KeyboardInstanceString = string
export type SerializedKeyboardDefinition = {name: string, keys: SerializedKeyDefinition[][]}
export type SerializedKeyboardInstance = {
  keyboard: SerializedKeyboardDefinition
  index?: number
  persistence: KeyboardPersistence
  size: KeyboardSize
  keyOverrides?: KeyOverride[]
}

export const keyIndexesEqual = (idx1: KeyIndex, idx2: KeyIndex) => (idx1.col === idx2.col && idx1.row === idx2.row)

const editLockError = (name: string) => new Error(`keyboard name=${name} is locked for editing; create an editable clone first`)

export const constrainKeyIndex = (keyIdx: KeyIndex, keyDim: GridDimensions, gridDim: GridDimensions): KeyIndex => {
  return {
    row: Math.min(Math.max(keyIdx.row, 0), gridDim.height - keyDim.height),
    col: Math.min(Math.max(keyIdx.col, 0), gridDim.width - keyDim.width)
  }
}

export const constrainKeyDimensions = (keyIdx: KeyIndex, keyDim: GridDimensions, gridDim: GridDimensions): GridDimensions => {
  return new GridDimensions(
    Math.min(Math.max(keyDim.width, 1), gridDim.width - keyIdx.col),
    Math.min(Math.max(keyDim.height, 1), gridDim.height - keyIdx.row)
  )
}

/**
 * Generate a new keyboard instance id only guaranteed unique if not performed within same millisecond for same args.
 * 
 * @param name Keyboard name.
 * @param index Numeric identifier, like an array index, version number, etc.
 */
export const keyboardInstanceId = (name: string, index=0) => {
  return `[${index}=${name}]@${new Date().toISOString()}`
}

export default class KeyboardDefinition {
  protected _name: string
  private _prevVersion: KeyboardDefinition|undefined
  private _saved: boolean = true

  constructor(
    name: string,
    protected keys: KeyDefinition[][],
    public readonly lockEdit: boolean = true,
    prevVersion?: KeyboardDefinition,
    defineShadows: boolean = true
  ) {
    this._name = name
    this._prevVersion = prevVersion

    if (defineShadows) {
      KeyboardDefinition.defineShadows(this.keys)
    }
  }

  get name() {
    return this._name
  }

  set name(name: string) {
    if (this.lockEdit) {
      throw editLockError(this.name)
    }
    this._name = name
  }

  getKey(row: number, col: number): KeyDefinition|undefined {
    return (this.keys[row] || [])[col]
  }

  setKey(index: KeyIndex, key: KeyDefinition) {
    if (this.lockEdit) {
      throw editLockError(this.name)
    }
    
    const oldKeyDim = this.keys[index.row][index.col].dimensions
    const newKeyDim = key.dimensions
    const updateDimensions = !oldKeyDim.equals(newKeyDim)
    let shadowUpdateKeys: KeyIndex[] = []
    if (updateDimensions) {
      shadowUpdateKeys = shadowUpdateKeys.concat(
        // keys under previous location bridge are not shadows
        KeyboardDefinition.defineShadow(this.keys, index, oldKeyDim, false),
        // keys under new location bridge are shadows
        KeyboardDefinition.defineShadow(this.keys, index, newKeyDim, true)
      )
    }

    const dim = this.dimensions
    if (index.row < dim.height && index.col < dim.width) {
      this.keys[index.row][index.col] = key
    }

    this._saved = false

    return {
      updateDimensions,
      shadowUpdateKeys
    }
  }

  moveKey(index: KeyIndex, newIndex: KeyIndex) {
    if (this.lockEdit) {
      throw editLockError(this.name)
    }

    // previous location cell becomes empty
    const key = this.keys[index.row][index.col]
    this.keys[index.row][index.col] = KeyDefinition.empty()

    // new location cell becomes key
    this.keys[newIndex.row][newIndex.col] = key
    
    let shadowUpdateKeys: KeyIndex[] = []
    if (key.isBridge) {
      const dim = key.dimensions
      
      shadowUpdateKeys = shadowUpdateKeys.concat(
        // keys under previous location bridge are not shadows
        KeyboardDefinition.defineShadow(this.keys, index, dim, false),
        // keys under new location bridge are shadows
        KeyboardDefinition.defineShadow(this.keys, newIndex, dim, true)
      )
    }

    this._saved = false

    return {
      shadowUpdateKeys
    }
  }

  get dimensions() {
    return new GridDimensions(this.keys[0].length, this.keys.length)
  }

  set dimensions(dimensions: GridDimensions) {
    if (this.lockEdit) {
      throw editLockError(this.name)
    }

    // create adjusted keys grid with empty keys in new cells
    const keys = new Array(dimensions.height)
    for (let r = 0; r < dimensions.height; r++) {
      keys[r] = this.getRowSlice(r, dimensions.width)
    }

    this.keys = keys
    this._saved = false
  }

  allKeys(): KeyDefinition[] {
    const dims = this.dimensions
    const keys = new Array(dims.height * dims.width)

    let r=0, c=0
    for (let i=0; i<keys.length; i++) {
      keys[i] = this.keys[r][c]

      c++
      if (c >= dims.width) {
        c=0
        r++
      }
    }

    return keys
  }

  private getRowSlice(row: number, length: number): KeyDefinition[] {
    let rowSlice: KeyDefinition[] = this.keys[row]?.slice(0, length) || []

    // attempt to get from previous version
    rowSlice = rowSlice.concat(
      (this._prevVersion?.keys[row] || []).slice(rowSlice.length, length)
    )
    
    // if row is still too short, add empty keys
    for (let c = rowSlice.length; c < length; c++) {
      rowSlice.push(KeyDefinition.empty())
    }

    return rowSlice
  }

  private static defineShadow(keys: KeyDefinition[][], keyIdx: KeyIndex, keyDim: GridDimensions, isShadow: boolean = true) {
    const shadowUpdateKeys: KeyIndex[] = []

    // right and down neighbors are shadows
    for (let r=0; r<keyDim.height; r++) {
      for (let c=0; c<keyDim.width; c++) {
        // skip self
        if (r==0 && c==0) continue

        const idx: KeyIndex = {row: keyIdx.row + r, col: keyIdx.col + c}
        keys[idx.row][idx.col].isShadow = isShadow

        shadowUpdateKeys.push(idx)
      }
    }

    return shadowUpdateKeys
  }

  private static defineShadows(keys: KeyDefinition[][]) {
    for (let r=0; r<keys.length; r++) {
      const row = keys[r]

      for (let c=0; c<row.length; c++) {
        const key = row[c]

        if (key.isBridge) {
          this.defineShadow(keys, {row: r, col: c}, key.dimensions)
        }
      }
    }
  }

  clone(name: string = this._name, lockEdit: boolean = false) {
    return new KeyboardDefinition(
      name,
      this.keys.map((row) => {
        return row.map((key) => {
          return key.clone()
        })
      }),
      lockEdit,
      this
    )
  }

  save() {
    this._prevVersion = this
    this._saved = true
  }

  equals(other: KeyboardDefinition, includeName: boolean = true) {
    if (includeName && this._name !== other._name) return false

    const dimensions = this.dimensions
    if (!dimensions.equals(other.dimensions)) return false

    let key: KeyDefinition|undefined, otherKey: KeyDefinition|undefined
    for (let r=0; r<dimensions.height; r++) {
      for (let c=0; c<dimensions.width; c++) {
        key = this.getKey(r, c)
        otherKey = other.getKey(r, c)
        
        // either key is undefined and other is not
        if (key !== otherKey && (key || otherKey) === undefined) {
          return false
        }

        // key definition mismatch
        if (!key?.equals(otherKey)) {
          return false
        }
      }
    }

    return true
  }

  toJSON() {
    return {
      name: this.name,
      keys: this.keys
    }
  }

  static fromJSON(o: SerializedKeyboardDefinition) {
    return new KeyboardDefinition(
      o.name, 
      o.keys.map(row => row.map(key => KeyDefinition.fromJSON(key)))
    )
  }
}

export class KeyboardInstance {
  public readonly instanceId: string
  private _parentInstanceId: string|undefined
  public get parentInstanceId() {
    return this._parentInstanceId
  }
  public readonly keyboard: KeyboardDefinition
  private persistence: KeyboardPersistence
  private size: KeyboardSize
  private _canDelete: boolean
  public get canDelete() {
    return this._canDelete
  }

  constructor(
    keyboard: KeyboardDefinition,
    { instanceId, index = 0, persistence, size, name, canDelete = true, keyOverrides = [], parentInstanceId, cloneKeyboard = true }: { 
      instanceId?: string
      index?: number
      persistence: KeyboardPersistence
      size: KeyboardSize
      name?: string
      canDelete?: boolean
      keyOverrides?: KeyOverride[]
      parentInstanceId?: string
      cloneKeyboard?: boolean
    }
  ) {
    this.keyboard = cloneKeyboard ? keyboard.clone(name, false) : keyboard
    this.instanceId = instanceId || keyboardInstanceId(this.keyboard.name, index)
    this._parentInstanceId = parentInstanceId
    this.persistence = persistence
    this.size = size
    this._canDelete = canDelete
    
    keyOverrides.forEach(this.saveKey, this)
  }

  get config() {
    return {
      persistence: this.persistence,
      size: this.size
    }
  }

  setConfig(
    { persistence, size }: {
      persistence: KeyboardPersistence
      size: KeyboardSize
    }
  ) {
    this.persistence = persistence
    this.size = size
  }

  protected _getDescendants(result: Map<string, KeyboardInstance>) {
    for (const keyMap of this.keyboard.allKeys().map(k => k.map)) {
      for (const childKeyboard of keyMap.values(false, true) as KeyboardInstance[]) {
        if (!result.has(childKeyboard.instanceId)) {
          // populate parent references on demand
          childKeyboard._parentInstanceId = this.instanceId
          // cascade canDelete
          childKeyboard._canDelete = this._canDelete

          result.set(childKeyboard.instanceId, childKeyboard)

          childKeyboard._getDescendants(result)
        }
      }
    }
  }

  getDescendants(): KeyboardInstance[] {
    const descendants: Map<string, KeyboardInstance> = new Map()

    this._getDescendants(descendants)

    return Array.from(descendants.values())
  }

  clone(
    { parentInstanceId, instanceId, canDelete }: { 
      parentInstanceId?: string
      instanceId?: string
      canDelete?: boolean
    } = {}
  ) {
    return new KeyboardInstance(
      this.keyboard,
      { 
        instanceId: instanceId || this.instanceId,
        parentInstanceId: parentInstanceId || this.parentInstanceId,
        persistence: this.persistence,
        size: this.size,
        canDelete: canDelete
      }
    )
  }

  private saveKey(keyOverride: KeyOverride) {
    const key = this.keyboard.getKey(keyOverride.row, keyOverride.col)
    if (key === undefined) {
      throw new Error(
        `failed to override key at invalid location=${keyOverride.col},${keyOverride.row} `
        + `within grid dimensions=${this.keyboard.dimensions}`
      )
    }

    if (keyOverride.key.label) {
      for (const [zone, label] of keyOverride.key.label.entries()) {
        key.label.set(zone, label)
      }
    }
    if (keyOverride.key.map) {
      for (const [gesture, keys] of keyOverride.key.map.entries()) {
        key.map.set(gesture, keys)
      }
    }
  }

  save(): KeyboardInstanceString {
    return JSON.stringify(this)
  }

  toJSON() {
    return {
      keyboard: this.keyboard,
      persistence: this.persistence,
      size: this.size
    }
  }

  static fromJSON(o: SerializedKeyboardInstance) {
    return new KeyboardInstance(
      KeyboardDefinition.fromJSON(o.keyboard),
      {...o}
    )
  }

  static load(
    s: KeyboardInstanceString|SerializedKeyboardInstance, 
    { persistence, size, keyOverrides } : {
      persistence?: KeyboardPersistence
      size?: KeyboardSize
      keyOverrides?: KeyOverride[]
    } = {}
  ) {
    const raw = typeof s === 'string' ? JSON.parse(s) : s

    raw.persistence = (persistence || raw.persistence)
    raw.size = (size || raw.size)
    raw.keyOverrides = keyOverrides

    return this.fromJSON(raw)
  }

  static loadMany(
    s: string, 
    { persistence, size, keyOverrides } : {
      persistence?: KeyboardPersistence
      size?: KeyboardSize
      keyOverrides?: KeyOverride[]
    } = {}
  ) {
    const raw: SerializedKeyboardInstance[] = JSON.parse(s)

    return raw.map(s => this.load(s, { persistence, size, keyOverrides }))
  }

  /**
   * Compare with other keyboard for deep equality. Ignores identifiers like `instanceId` and `parentInstanceId`.
   */
  equals(other: KeyboardInstance, includeName: boolean = false) {
    return (
      this.keyboard.equals(other.keyboard, includeName)
      && this.persistence === other.persistence
      && this.size === other.size
    )
  }
}