import KeyLabel, { SerializedKeyLabel } from "@lib/keyLabel"
import KeyMap, { SerializedKeyMap } from "@lib/keyMap"
import GridDimensions, { SerializedGridDimensions } from "./gridDimensions"

export interface KeyAttributes { label?: KeyLabel; map?: KeyMap}
export type SerializedKeyDefinition = {
  label: SerializedKeyLabel
  map: SerializedKeyMap
  dimensions?: SerializedGridDimensions
  isShadow?: boolean
}

export class KeyDefinition implements KeyAttributes { 
  label: KeyLabel
  map: KeyMap
  private _dimensions: GridDimensions|undefined
  private _isShadow: boolean|undefined

  constructor(
    { label, map, dimensions, isShadow }: {
      label: KeyLabel
      map: KeyMap
      dimensions?: GridDimensions
      isShadow?: boolean
    }
  ) {
    this.label = label
    this.map = map
    this._dimensions = dimensions
    this._isShadow = isShadow
  }

  equals(other: KeyDefinition|undefined) {
    return (
      other instanceof KeyDefinition 
      && this.label.equals(other.label) 
      && this.map.equals(other.map)
      && this.dimensions.equals(other.dimensions)
    )
  }

  get dimensions() {
    return this._dimensions?.clone() || new GridDimensions(1,1)
  }

  set dimensions(dimensions: GridDimensions) {
    this._dimensions = dimensions
  }

  get isShadow() {
    return !!this._isShadow
  }

  set isShadow(isShadow: boolean) {
    this._isShadow = isShadow
  }

  /**
   * Whether key spans/ bridges multiple columns or rows.
   */
  get isBridge() {
    return this._dimensions && (this._dimensions.width > 1 || this._dimensions.height > 1)
  }

  static empty() {
    return new KeyDefinition({ label: new KeyLabel(), map: new KeyMap() })
  }

  clone() {
    return new KeyDefinition({ 
      label: this.label.clone(), 
      map: this.map.clone(),
      dimensions: this._dimensions?.clone(),
      isShadow: this._isShadow
    })
  }

  toJSON() {
    return {
      label: this.label,
      map: this.map,
      dimensions: this._dimensions,
      isShadow: this._isShadow
    }
  }

  static fromJSON(o: SerializedKeyDefinition): KeyDefinition {
    return new KeyDefinition({
      label: KeyLabel.fromJSON(o.label),
      map: KeyMap.fromJSON(o.map),
      dimensions: o.dimensions !== undefined ? GridDimensions.fromJSON(o.dimensions) : undefined,
      isShadow: o.isShadow
    })
  }
} 
 