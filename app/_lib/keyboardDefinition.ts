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

export type KeyAttributes = {label?: KeyLabel, map?: KeyMap}
export type KeyDefinition = {label: KeyLabel, map: KeyMap}

export default class KeyboardDefinition {
  constructor(
    public readonly name: string,
    protected readonly keys: KeyDefinition[][]
  ) {}

  getKey(row: number, col: number) {
    return this.keys[row][col]
  }

  get dimensions() {
    return new GridDimensions(this.keys[0].length, this.keys.length)
  }
}

export class ChildKeyboardDefinition {
  public readonly persistance: KeyboardPersistance
  public readonly size: KeyboardSize

  constructor(
    public readonly keyboard: KeyboardDefinition,
    { persistance, size, keyOverrides = [] }: { 
      persistance: KeyboardPersistance
      size: KeyboardSize
      keyOverrides?: { row: number, col: number, key: KeyAttributes }[]
    }
  ) {
    this.persistance = persistance
    this.size = size
    
    for (const ko of keyOverrides) {
      const key = this.keyboard.getKey(ko.row, ko.col)

      if (ko.key.label) {
        for (const [zone, label] of ko.key.label.entries()) {
          key.label.set(zone, label)
        }
      }
      if (ko.key.map) {
        for (const [gesture, keys] of ko.key.map.entries()) {
          key.map.set(gesture, keys)
        }
      }
    }
  }
}