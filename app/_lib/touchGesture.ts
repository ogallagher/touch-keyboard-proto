import { Cardinal, Diagonal, Direction, headingToDirection, isAcute, isCardinal, isPerpendicular, toOpposite } from "@lib/orientation"
import type { MouseEvent, TouchEvent } from "react"
import { Group, IPt, Pt } from "pts"
import pino from "pino"

const logger = pino({
  name: 'touch-gesture'
})

const holdDelaySec = 0.75

const enum TouchGestureSegmentType {
  TOUCH = 't',
  HOLD = 'h',
  CARDINAL_SWIPE = 'cs',
  DIAGONAL_SWIPE = 'ds',
  CORNER = 'L',
  RETURN = 'r',
  RETURN_OVER = 'ro'
}

export enum TouchGestureType {
  TOUCH = TouchGestureSegmentType.TOUCH,
  TOUCH_HOLD = `${TouchGestureSegmentType.TOUCH}-${TouchGestureSegmentType.HOLD}`,
  CARDINAL_SWIPE = TouchGestureSegmentType.CARDINAL_SWIPE,
  CARDINAL_SWIPE_HOLD = `${TouchGestureSegmentType.CARDINAL_SWIPE}-${TouchGestureSegmentType.HOLD}`,
  DIAGONAL_SWIPE = TouchGestureSegmentType.DIAGONAL_SWIPE,
  DIAGONAL_SWIPE_HOLD = `${TouchGestureSegmentType.DIAGONAL_SWIPE}-${TouchGestureSegmentType.HOLD}`,
  CARDINAL_CORNER_SWIPE = `${TouchGestureSegmentType.CARDINAL_SWIPE}-${TouchGestureSegmentType.CORNER}`,
  DIAGONAL_CORNER_SWIPE = `${TouchGestureSegmentType.DIAGONAL_SWIPE}-${TouchGestureSegmentType.CORNER}`,
  CARDINAL_RETURN_SWIPE = `${TouchGestureSegmentType.CARDINAL_SWIPE}-${TouchGestureSegmentType.RETURN}`,
  DIAGONAL_RETURN_SWIPE = `${TouchGestureSegmentType.DIAGONAL_SWIPE}-${TouchGestureSegmentType.RETURN}`,
  CARDINAL_RETURN_OVER_SWIPE = `${TouchGestureSegmentType.CARDINAL_SWIPE}-${TouchGestureSegmentType.RETURN_OVER}`,
  DIAGONAL_RETURN_OVER_SWIPE = `${TouchGestureSegmentType.CARDINAL_SWIPE}-${TouchGestureSegmentType.RETURN_OVER}`
}

export function isCorner(d1: Direction, d2: Direction) {
  if (isCardinal(d1)) {
     return isPerpendicular(d1 as unknown as Cardinal, d2)
  }
  else {
    return isAcute(d1 as unknown as Diagonal, d2)
  }
}

export function isReturn(d1: Direction, d2: Direction) {
  return (isCardinal(d1) === isCardinal(d2)) && (toOpposite(d1) == d2)
}

export default class TouchGesture {
  private _type: TouchGestureType
  private _direction?: Direction
  private _cornerDirection?: Direction
  private _complete: boolean
  private onComplete?: (g: TouchGesture) => any
  private _points: Group
  private times: Date[] = []
  private readonly segmentLength: number
  private holdTimeout?: NodeJS.Timeout

  constructor(
    {type, direction, origin, whenStart, segmentLength, onComplete}: {
      type: TouchGestureType
      direction?: Direction
      origin: IPt
      whenStart: Date
      segmentLength: number
      onComplete?: (g: TouchGesture) => any
    }
  ) {
    this._type = type
    this._direction = direction
    this._complete = false
    this.onComplete = onComplete
    this._points = new Group(new Pt(origin))
    this.times.push(whenStart)
    this.segmentLength = segmentLength
    this.startHoldTimeout()
  }

  get type() { 
    return this._type 
  }

  get direction() { 
    return this._direction 
  }

  get cornerDirection() {
    return this._cornerDirection
  }

  get complete() {
    return this._complete
  }

  get points() {
    return this._points
  }

  set complete(v: boolean) {
    if (v && !this._complete) {
      this.clearHoldTimeout()

      if (this.onComplete) {
        this.onComplete(this)
      }
    }

    this._complete = v
  }

  get returnSegmentMax() {
    return this.segmentLength * 1.5
  }

  private clearHoldTimeout() {
    clearTimeout(this.holdTimeout)
  }

  private startHoldTimeout() {
    this.clearHoldTimeout()

    this.holdTimeout = setTimeout(
      () => this.addHoldSegment(), 
      holdDelaySec * 1000
    )
  }

  static create(e: TouchEvent|MouseEvent, segmentLength: number, onComplete?: (g: TouchGesture) => any) {
    logger.info(`create gesture on event type=${e.type}`)

    return new TouchGesture({ 
      type: TouchGestureType.TOUCH,
      origin: {
        x: (e instanceof TouchEvent) ? e.touches[0].clientX : (e as MouseEvent).clientX,
        y: (e instanceof TouchEvent) ? e.touches[0].clientY : (e as MouseEvent).clientY
      },
      whenStart: new Date(),
      segmentLength,
      onComplete
    })
  }

  addHoldSegment() {
    if (!this.complete) {
      switch (this._type) {
        case TouchGestureType.TOUCH:
          this._type = TouchGestureType.TOUCH_HOLD
          break
        case TouchGestureType.CARDINAL_SWIPE:
          this._type = TouchGestureType.CARDINAL_SWIPE_HOLD
          break
        case TouchGestureType.DIAGONAL_SWIPE:
          this._type = TouchGestureType.DIAGONAL_SWIPE_HOLD
          break
        default:
          logger.warn(`skip unsupported gesture segment ${TouchGestureSegmentType.HOLD} after ${this._type}`)
      }
      this.complete = true
    }
  }

  update(e: TouchEvent|MouseEvent) {
    if (this._complete) return

    const p = new Pt({
      x: (e instanceof TouchEvent) ? e.touches[0].clientX : (e as MouseEvent).clientX,
      y: (e instanceof TouchEvent) ? e.touches[0].clientY : (e as MouseEvent).clientY
    })

    switch (e.type) {
      case 'touchmove':
      case 'mousemove':
        const diff = p.$subtract(this._points.q1)
        const length = diff.magnitude()
        const dir = headingToDirection(diff.angle())

        if (length > this.segmentLength) {
          // cardinal or diagonal
          if (this._type == TouchGestureType.TOUCH) {
            // swipe from center
            this._points.push(p)
            this._direction = dir
            this._type = (
              isCardinal(dir) ? TouchGestureType.CARDINAL_SWIPE : TouchGestureType.DIAGONAL_SWIPE
            )

            this.startHoldTimeout()
          }
          // return or corner
          else if (
            (this._type === TouchGestureType.CARDINAL_SWIPE || this._type === TouchGestureType.DIAGONAL_SWIPE)
            && this._direction !== dir
          ) {
            // logger.info(`[${this._points.join(' ')}]: ${this._direction} -L-> ${dir}`)
            if (isReturn(this._direction!, dir)) {
              // return
              this._points.push(p)
              this._type = (
                this._type === TouchGestureType.CARDINAL_SWIPE
                ? TouchGestureType.CARDINAL_RETURN_SWIPE
                : TouchGestureType.DIAGONAL_RETURN_SWIPE
              )

              // no hold beyond basic swipe
              this.clearHoldTimeout()
            }
            else if (isCorner(this._direction!, dir)) {
              // corner
              this._points.push(p)
              this._cornerDirection = dir
              this._type = (
                this._type === TouchGestureType.CARDINAL_SWIPE
                ? TouchGestureType.CARDINAL_CORNER_SWIPE
                : TouchGestureType.DIAGONAL_CORNER_SWIPE
              )

              // no hold beyond basic swipe
              this.clearHoldTimeout()
            }
            else {
              logger.warn(`ignore unsupported segment direction=${dir} after ${this}`)
            }
          }
          // over return
          else if (
            (this._type === TouchGestureType.CARDINAL_RETURN_SWIPE || this._type === TouchGestureType.DIAGONAL_RETURN_SWIPE)
            && dir === toOpposite(this._direction!)
            && length > this.returnSegmentMax - this.segmentLength
          ) {
            this._points.push(p)
            this._type = (
              this._type === TouchGestureType.CARDINAL_RETURN_SWIPE
              ? TouchGestureType.CARDINAL_RETURN_OVER_SWIPE
              : TouchGestureType.DIAGONAL_RETURN_OVER_SWIPE
            )
          }
          // else, ignore additional segments
        }
        else if (
          this._direction === dir
          && (this._type === TouchGestureType.CARDINAL_SWIPE || this._type === TouchGestureType.DIAGONAL_SWIPE)
        ) {
          // update last point to extend
          this._points.q1.set(p)
        }
        break

      case 'touchend':
      case 'mouseup':
        this.complete = true
        break

      default:
        logger.warn(`skip update touch event type=${e.type}`)
    }
  }

  toString() {
    return (
      `TouchGesture[`
      + `type=${this._type} `
      + `direction=${
        this._cornerDirection === undefined 
        ? this._direction 
        : `${this._direction}-${this._cornerDirection}`
      }]`
    )
  }
}