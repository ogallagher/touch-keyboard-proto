export default class KeyLabel {
  public readonly center: string
  public readonly up?: string
  public readonly right?: string
  public readonly down?: string
  public readonly left?: string

  constructor(
    { center, up, right, down, left }: {
      center: string
      up?: string
      right?: string
      down?: string
      left?: string
    }
  ) {
    this.center = center
    this.up = up
    this.right = right
    this.down = down
    this.left = left
  }
}