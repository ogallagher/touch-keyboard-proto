import GridDimensions from "@lib/gridDimensions"
import { KeyAttributes, KeyDefinition, SerializedKeyDefinition } from "@lib/keyDefinition"

export enum KeyboardPersistance {
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
  persistance: KeyboardPersistance
  size: KeyboardSize
  keyOverrides?: KeyOverride[]
}

const editLockError = (name: string) => new Error(`keyboard name=${name} is locked for editing; create an editable clone first`)

export default class KeyboardDefinition {
  protected _name: string
  private _prevVersion: KeyboardDefinition|undefined
  private _saved: boolean = true

  constructor(
    name: string,
    protected keys: KeyDefinition[][],
    public readonly lockEdit: boolean = true,
    prevVersion?: KeyboardDefinition
  ) {
    this._name = name
    this._prevVersion = prevVersion
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
    const dim = this.dimensions
    if (index.row < dim.height && index.col < dim.width) {
      this.keys[index.row][index.col] = key
    }
    this._saved = false
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

  clone(name: string = this._name, lockEdit: boolean = false) {
    return new KeyboardDefinition(
      name,
      this.keys.map((row) => {
        return row.map((key) => {
          return new KeyDefinition({ 
            label: key.label.clone(), 
            map: key.map.clone()
          })
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
  public readonly keyboard: KeyboardDefinition
  public readonly persistance: KeyboardPersistance
  public readonly size: KeyboardSize

  constructor(
    keyboard: KeyboardDefinition,
    { instanceId, index = 0, persistance, size, name, keyOverrides = [] }: { 
      instanceId?: string
      index?: number
      persistance: KeyboardPersistance
      size: KeyboardSize
      name?: string
      keyOverrides?: KeyOverride[]
    }
  ) {
    this.instanceId = instanceId || `${KeyboardInstance.name}[${index}]@${new Date().toISOString()}`
    this.keyboard = keyboard.clone(name, false)
    this.persistance = persistance
    this.size = size
    
    keyOverrides.forEach(this.saveKey, this)
  }

  clone() {
    return new KeyboardInstance(
      this.keyboard,
      this
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
      persistance: this.persistance,
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
    { persistance, size, keyOverrides } : {
      persistance?: KeyboardPersistance
      size?: KeyboardSize
      keyOverrides?: KeyOverride[]
    } = {}
  ) {
    const raw = typeof s === 'string' ? JSON.parse(s) : s

    raw.persistance = (persistance || raw.persistance)
    raw.size = (size || raw.size)
    raw.keyOverrides = keyOverrides

    return this.fromJSON(raw)
  }

  static loadMany(
    s: string, 
    { persistance, size, keyOverrides } : {
      persistance?: KeyboardPersistance
      size?: KeyboardSize
      keyOverrides?: KeyOverride[]
    } = {}
  ) {
    const raw: SerializedKeyboardInstance[] = JSON.parse(s)

    return raw.map(s => this.load(s, { persistance, size, keyOverrides }))
  }

  equals(other: KeyboardInstance, includeName: boolean = false) {
    return (
      this.keyboard.equals(other.keyboard, includeName)
      && this.persistance === other.persistance
      && this.size === other.size
    )
  }
}