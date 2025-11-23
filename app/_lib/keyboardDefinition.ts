import KeyLabel from "@lib/keyLabel"
import KeyMap from "@lib/keyMap"

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
    public readonly keys: KeyDefinition[][]
  ) {}
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
    
    for (let ko of keyOverrides) {
      const key = this.keyboard.keys[ko.row][ko.col]

      if (ko.key.label) {
        for (let [zone, label] of ko.key.label.entries()) {
          key.label.set(zone, label)
        }
      }
      if (ko.key.map) {
        for (let [gesture, keys] of ko.key.map.entries()) {
          key.map.set(gesture, keys)
        }
      }
    }
  }
}