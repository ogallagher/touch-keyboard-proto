import pino from "pino"

const logger = pino({
  name: 'grid-dimensions'
})

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
      logger.error(`grid cannot have less than 1 column`)
      width = 1
    }
    return new GridDimensions(width, this.height)
  }

  rowAdd(delta: number) {
    let height = this.height + delta
    if (height < 1) {
      logger.error(`grid cannot have less than 1 row`)
      height = 1
    }
    return new GridDimensions(this.width, height)
  }
}