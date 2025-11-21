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

  constructor(
    { center, up, right, down, left, upright, downright, downleft, upleft }: {
      center: string
      up?: string
      right?: string
      down?: string
      left?: string
      upright?: string
      downright?: string
      downleft?: string
      upleft?: string
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
  }
}