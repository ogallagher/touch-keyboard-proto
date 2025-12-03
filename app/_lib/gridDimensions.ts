export type SerializedGridDimensions = {
  width: number
  height: number
}

export default class GridDimensions {
  constructor(
    /**
     * Column count.
     */
    public readonly width: number,
    /**
     * Row count.
     */
    public readonly height: number
  ) { }

  colAdd(delta: number) {
    let width = this.width + delta
    if (width < 1) {
      console.error(`grid cannot have less than 1 column`)
      width = 1
    }
    return new GridDimensions(width, this.height)
  }

  rowAdd(delta: number) {
    let height = this.height + delta
    if (height < 1) {
      console.error(`grid cannot have less than 1 row`)
      height = 1
    }
    return new GridDimensions(this.width, height)
  }

  toString() {
    return `${this.width}x${this.height}`
  }

  equals(other: GridDimensions) {
    return this.width === other.width && this.height === other.height
  }

  clone() {
    return new GridDimensions(this.width, this.height)
  }

  static fromJSON(o: SerializedGridDimensions) {
    return new GridDimensions(o.width, o.height)
  }
}