import { Cardinal, Diagonal, Direction } from "@lib/orientation"
import { InnerTouchGestureSegmentType } from "@lib/touchGesture"

export type Zone = 'center'|'up'|'right'|'down'|'left'|'upright'|'downright'|'downleft'|'upleft'
export type PseudoCond = 'shift'|'capslock'|InnerTouchGestureSegmentType

export class ZoneKey {
  constructor(
    public readonly zone: Zone,
    public readonly pseudo?: PseudoCond,
    public readonly direction?: Direction|Cardinal|Diagonal
  ) {}

  toString() {
    return (
      [this.zone, this.pseudo, this.direction]
      .filter(v => v)
      .join('_')
    )
  }
}

export default class KeyLabel {
  protected readonly values: Map<string, string|undefined> = new Map()

  constructor(values: [ZoneKey, string][] = []) {
    for (let [key, val] of values) {
      this.values.set(key.toString(), val)
    }
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
      InnerTouchGestureSegmentType.CARDINAL_SWIPE, 
      [Cardinal.UP, Cardinal.RIGHT, Cardinal.DOWN, Cardinal.LEFT],
      ['center', 'up', 'right', 'down', 'left']
    )
  }

  getPseudo(shift?: boolean, capslock?: boolean, gestureSegment?: InnerTouchGestureSegmentType): PseudoCond|undefined {
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