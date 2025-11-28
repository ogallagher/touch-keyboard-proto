import { Cardinal, Diagonal, Direction } from "@lib/orientation"
import { InitGestureSegmentType } from "@lib/touchGesture"

export type Zone = 'center'|'up'|'right'|'down'|'left'|'upright'|'downright'|'downleft'|'upleft'
export type PseudoCond = 'shift'|'capslock'|InitGestureSegmentType

/**
 * A non terminal gesture segment and direction used for defining a key label pseudozone.
 */
export type GestureSegment = {
  segment?: InitGestureSegmentType, 
  direction?: Direction
}

export class ZoneKey {
  static readonly strDelim = '_'

  constructor(
    public readonly zone: Zone,
    public readonly pseudo?: PseudoCond,
    public readonly direction?: Direction|Cardinal|Diagonal
  ) {}

  toString() {
    return (
      [this.zone, this.pseudo, this.direction]
      .filter(v => v)
      .join(ZoneKey.strDelim)
    )
  }

  static fromString(s: string) {
    const [zone, pseudo = undefined, direction = undefined] = s.split(this.strDelim)
    return new ZoneKey(zone as Zone, pseudo as PseudoCond, direction as Direction)
  }
}

export default class KeyLabel {
  protected readonly values: Map<string, string> = new Map()
  protected _pseudoZoneShiftDefined: boolean = false
  protected _pseudoZoneCapsLockDefined: boolean = false
  protected _pseudoZoneGestureSegmentDefined: boolean = false

  constructor(values: [ZoneKey, string][] = []) {
    for (const [key, val] of values) {
      this.set(key, val)

      if (!this._pseudoZoneShiftDefined && key.pseudo === 'shift') {
        this._pseudoZoneShiftDefined = true
      }
      else if (!this._pseudoZoneCapsLockDefined && key.pseudo === 'capslock') {
        this._pseudoZoneCapsLockDefined = true
      }
      else if (!this._pseudoZoneGestureSegmentDefined && key.pseudo !== undefined) {
        this._pseudoZoneGestureSegmentDefined = true
      }
    }
  }

  entries(): [ZoneKey, string][] {
    return (
      [...this.values.entries()]
      .map(([zoneStr, label]) => [ZoneKey.fromString(zoneStr), label!])
    )
  }

  clone() {
    return new KeyLabel(this.entries())
  }

  set(zone: ZoneKey, label: string|undefined) {
    if (label === undefined) {
      this.values.delete(zone.toString())
    }
    else {
      this.values.set(zone.toString(), label)
    }
  }

  equals(other: KeyLabel) {
    if (this.values.size != other.values.size) {
      return false
    }

    const zoneKeys = new Set(this.values.keys())
    other.values.keys().forEach(zk => zoneKeys.add(zk))

    for (const zoneKey of zoneKeys) {
      if (this.values.get(zoneKey) !== other.values.get(zoneKey)) {
        return false
      }
    }

    return true
  }

  /**
   * Return whether any zone pseudo condition includes shift.
   */
  get pseudoZoneShiftDefined() { return this._pseudoZoneShiftDefined }

  /**
   * Return whether any zone pseudo condition includes capslock.
   */
  get pseudoZoneCapsLockDefined() { return this._pseudoZoneCapsLockDefined }
  
  /**
   * Return any zone pseudo condition includes any initial gesture segment.
   */
  get pseudoZoneGestureSegmentDefined() { return this._pseudoZoneGestureSegmentDefined }

  getPseudo(shift?: boolean, capslock?: boolean, gestureSegment?: InitGestureSegmentType): PseudoCond|undefined {
    if (shift) return 'shift'
    if (capslock) return 'capslock'
    if (gestureSegment) return gestureSegment
  }

  getZone(zone: Zone, pseudo?: PseudoCond, dir?: Direction): string|undefined {
    let res = this.values.get(new ZoneKey(zone, pseudo, dir).toString())

    if (pseudo === 'capslock') {
      res = res || this.values.get(new ZoneKey(zone, 'shift').toString())
    }

    res = res || this.values.get(zone)

    return res
  }
}