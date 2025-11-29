import KeyLabel, { SerializedKeyLabel } from "@lib/keyLabel"
import KeyMap, { SerializedKeyMap } from "@lib/keyMap"

export interface KeyAttributes { label?: KeyLabel; map?: KeyMap}
export type SerializedKeyDefinition = {label: SerializedKeyLabel, map: SerializedKeyMap}

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
    return (
      other instanceof KeyDefinition 
      && this.label.equals(other.label) 
      && this.map.equals(other.map)
    )
  }

  static empty() {
    return new KeyDefinition({ label: new KeyLabel(), map: new KeyMap() })
  }

  static fromJSON(o: SerializedKeyDefinition): KeyDefinition {
    return new KeyDefinition({
      label: KeyLabel.fromJSON(o.label),
      map: KeyMap.fromJSON(o.map)
    })
  }
} 
 