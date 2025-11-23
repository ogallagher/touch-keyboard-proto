import { Cardinal, Diagonal, Direction } from "@lib/orientation"
import { InitGestureSegmentType } from "@lib/touchGesture"

export type Zone = 'center'|'up'|'right'|'down'|'left'|'upright'|'downright'|'downleft'|'upleft'
export type PseudoCond = 'shift'|'capslock'|InitGestureSegmentType

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
  protected readonly values: Map<string, string|undefined> = new Map()

  constructor(values: [ZoneKey, string][] = []) {
    for (let [key, val] of values) {
      this.set(key, val)
    }
  }

  entries(): [ZoneKey, string|undefined][] {
    return (
      [...this.values.entries()]
      .map(([zoneStr, label]) => [ZoneKey.fromString(zoneStr), label])
    )
  }

  set(zone: ZoneKey, label: string|undefined) {
    this.values.set(zone.toString(), label)
  }

  protected pseudoZoneDefined(
    pseudo: PseudoCond, 
    directions: (Direction|Cardinal|Diagonal|undefined)[] = [undefined], 
    zones: Zone[] = ['center', 'up', 'right', 'down', 'left', 'upright', 'downright', 'downleft', 'upleft']
  ) {
    let res: string|undefined = undefined

    for (let dir of directions) {
      for (let zone of zones) {
        res ||= this.values.get(new ZoneKey(zone, pseudo, dir).toString())
      }
    }
    
    return res
  }

  get pseudoZoneShiftDefined() {
    return this.pseudoZoneDefined('shift')
  }

  get pseudoZoneCapsLockDefined() {
    return this.pseudoZoneDefined('capslock')
  }

  get pseudoZoneCardinalSwipeDefined() {
    return this.pseudoZoneDefined(
      InitGestureSegmentType.CARDINAL_SWIPE, 
      [Cardinal.UP, Cardinal.RIGHT, Cardinal.DOWN, Cardinal.LEFT],
      ['center', 'up', 'right', 'down', 'left']
    )
  }

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