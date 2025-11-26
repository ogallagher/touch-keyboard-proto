import KeyLabel from "@lib/keyLabel"
import KeyMap from "@lib/keyMap"
import GridDimensions from "./gridDimensions"

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
export interface KeyAttributes {label?: KeyLabel, map?: KeyMap}
export interface KeyDefinition extends KeyAttributes {label: KeyLabel, map: KeyMap}
export type KeyOverride = KeyIndex & {
  key: KeyAttributes
} 

export default class KeyboardDefinition {
  protected _name: string
  constructor(
    name: string,
    protected keys: KeyDefinition[][],
    public readonly lockEdit: boolean = true
  ) {
    this._name = name
  }

  get name() {
    return this._name
  }

  set name(name: string) {
    if (this.lockEdit) {
      throw new Error(`keyboard name=${this._name} is locked for editing; create an editable clone first`)
    }
    this._name = name
  }

  getKey(row: number, col: number): KeyDefinition|undefined {
    return (this.keys[row] || [])[col]
  }

  get dimensions() {
    return new GridDimensions(this.keys[0].length, this.keys.length)
  }

  set dimensions(dimensions: GridDimensions) {
    if (this.lockEdit) {
      throw new Error(`keyboard name=${this._name} is locked for editing; create an editable clone first`)
    }

    // create adjusted keys grid with empty keys in new cells
    const keys = new Array(dimensions.height)
    for (let r = 0; r < dimensions.height; r++) {
      keys[r] = this.keys[r]?.slice(0, dimensions.width) || new Array(dimensions.width)

      for (let c = 0; c < dimensions.width; c++) {
        keys[r][c] = keys[r][c] || { label: new KeyLabel(), map: new KeyMap() }
      }
    }

    this.keys = keys
  }

  clone(name: string = this._name, lockEdit: boolean = false) {
    return new KeyboardDefinition(
      name,
      this.keys.map((row) => {
        return row.map((key) => {
          return { 
            label: key.label.clone(), 
            map: key.map.clone()
          }
        })
      }),
      lockEdit
    )
  }
}

export class KeyboardInstance {
  public readonly keyboard: KeyboardDefinition
  public readonly persistance: KeyboardPersistance
  public readonly size: KeyboardSize

  constructor(
    keyboard: KeyboardDefinition,
    { persistance, size, name, keyOverrides = [] }: { 
      persistance: KeyboardPersistance
      size: KeyboardSize
      name?: string
      keyOverrides?: KeyOverride[]
    }
  ) {
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

  saveKey(keyOverride: KeyOverride) {
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
}