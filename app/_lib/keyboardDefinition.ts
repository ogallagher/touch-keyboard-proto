import KeyLabel from "@lib/keyLabel"
import KeyMap from "@lib/keyMap"

export default class KeyboardDefinition {
  constructor(
    public readonly keys: {label: KeyLabel, map: KeyMap}[][]
  ) {}
}