import KeyLabel from "@lib/keyLabel"
import KeyMap from "@lib/keyMap"

export interface KeyAttributes { label?: KeyLabel; map?: KeyMap}

export class KeyDefinition implements KeyAttributes { 
  label: KeyLabel
  map: KeyMap

  constructor(
    { label, map }: {
      label: KeyLabel
      map: KeyMap
    }
  ) {
    this.label = label
    this.map = map
  }

  equals(other: KeyDefinition|undefined) {
    return other instanceof KeyDefinition && this.label.equals(other.label) && this.map.equals(other.map)
  }

  static empty() {
    return new KeyDefinition({ label: new KeyLabel(), map: new KeyMap() })
  }
} 
 