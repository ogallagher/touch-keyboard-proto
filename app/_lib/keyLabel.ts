export type Zone = 'center'|'up'|'right'|'down'|'left'|'upright'|'downright'|'downleft'|'upleft'
export type PseudoCond = 'shift'|'capslock'

export default class KeyLabel {
  public readonly center: string
  public readonly up?: string
  public readonly right?: string
  public readonly down?: string
  public readonly left?: string
  public readonly upright?: string
  public readonly downright?: string
  public readonly downleft?: string
  public readonly upleft?: string
  public readonly center_shift?: string
  public readonly up_shift?: string
  public readonly right_shift?: string
  public readonly down_shift?: string
  public readonly left_shift?: string
  public readonly upright_shift?: string
  public readonly downright_shift?: string
  public readonly downleft_shift?: string
  public readonly upleft_shift?: string
  public readonly center_capslock?: string
  public readonly up_capslock?: string
  public readonly right_capslock?: string
  public readonly down_capslock?: string
  public readonly left_capslock?: string
  public readonly upright_capslock?: string
  public readonly downright_capslock?: string
  public readonly downleft_capslock?: string
  public readonly upleft_capslock?: string

  constructor(
    { 
      center, up, right, down, left, upright, downright, downleft, upleft,
      center_shift, up_shift, right_shift, down_shift, left_shift, upright_shift, downright_shift, downleft_shift, upleft_shift,
      center_capslock, up_capslock, right_capslock, down_capslock, left_capslock, upright_capslock, downright_capslock, downleft_capslock, upleft_capslock
    }: {
      center: string
      up?: string
      right?: string
      down?: string
      left?: string
      upright?: string
      downright?: string
      downleft?: string
      upleft?: string
      center_shift?: string
      up_shift?: string
      right_shift?: string
      down_shift?: string
      left_shift?: string
      upright_shift?: string
      downright_shift?: string
      downleft_shift?: string
      upleft_shift?: string
      center_capslock?: string
      up_capslock?: string
      right_capslock?: string
      down_capslock?: string
      left_capslock?: string
      upright_capslock?: string
      downright_capslock?: string
      downleft_capslock?: string
      upleft_capslock?: string
    }
  ) {
    this.center = center
    this.up = up
    this.right = right
    this.down = down
    this.left = left
    this.upright = upright
    this.downright = downright
    this.downleft = downleft
    this.upleft = upleft
    this.center_shift = center_shift
    this.up_shift = up_shift
    this.right_shift = right_shift
    this.down_shift = down_shift
    this.left_shift = left_shift
    this.upright_shift = upright_shift
    this.downright_shift = downright_shift
    this.downleft_shift = downleft_shift
    this.upleft_shift = upleft_shift
    this.center_capslock = center_capslock
    this.up_capslock = up_capslock
    this.right_capslock = right_capslock
    this.down_capslock = down_capslock
    this.left_capslock = left_capslock
    this.upright_capslock = upright_capslock
    this.downright_capslock = downright_capslock
    this.downleft_capslock = downleft_capslock
    this.upleft_capslock = upleft_capslock
  }

  get pseudoZoneShiftDefined() {
    return (this.center_shift || this.up_shift || this.right_shift || this.down_shift || this.left_shift || this.upright_shift || this.downright_shift || this.downleft_shift || this.upleft_shift)
  }

  get pseudoZoneCapsLockDefined() {
    return (this.center_capslock || this.up_capslock || this.right_capslock || this.down_capslock || this.left_capslock || this.upright_capslock || this.downright_capslock || this.downleft_capslock || this.upleft_capslock)
  }

  getPseudo(shift?: boolean, capslock?: boolean): PseudoCond|undefined {
    if (shift) return 'shift'
    if (capslock) return 'capslock'
  }

  getZone(zone: Zone, pseudo?: PseudoCond): string|undefined {
    let res: string|undefined = undefined

    if (pseudo) {
      res = this[`${zone}_${pseudo}`]
    }

    if (pseudo === 'capslock') {
      res = res || this[`${zone}_shift`]
    }

    res = res || this[zone]

    return res
  }
}