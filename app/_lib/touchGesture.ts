import { Cardinal, Diagonal, Direction, headingToDirection, isAcute, isCardinal, isPerpendicular, toOpposite } from "@lib/orientation"
import { Group, IPt, Pt } from "pts"
import pino from "pino"
import KeyMap from "@lib/keyMap"

const logger = pino({
  name: 'touch-gesture'
})

export const holdDelaySec = 0.5

export const enum InitGestureSegmentType {
  TOUCH = 't',
  CARDINAL_SWIPE = 'cs',
  DIAGONAL_SWIPE = 'ds'
}

export const enum TermGestureSegmentType {
  HOLD = 'h',
  CORNER = 'L',
  RETURN = 'r',
  RETURN_OVER = 'ro'
}

export const enum TouchGestureSegmentType {
  TOUCH = InitGestureSegmentType.TOUCH,
  CARDINAL_SWIPE = InitGestureSegmentType.CARDINAL_SWIPE,
  DIAGONAL_SWIPE = InitGestureSegmentType.DIAGONAL_SWIPE,
  HOLD = TermGestureSegmentType.HOLD,
  CORNER = TermGestureSegmentType.CORNER,
  RETURN = TermGestureSegmentType.RETURN,
  RETURN_OVER = TermGestureSegmentType.RETURN_OVER
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
  DIAGONAL_RETURN_OVER_SWIPE = `${TouchGestureSegmentType.DIAGONAL_SWIPE}-${TouchGestureSegmentType.RETURN_OVER}`
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

export const isTouch = (e: TouchEvent|MouseEvent) => e.type.indexOf('touch') !== -1

export function typeWithoutHold(t: TouchGestureType) {
  switch (t) {
    case TouchGestureType.TOUCH_HOLD:
      return TouchGestureType.TOUCH
    case TouchGestureType.CARDINAL_SWIPE_HOLD:
      return TouchGestureType.CARDINAL_SWIPE
    case TouchGestureType.DIAGONAL_SWIPE_HOLD:
      return TouchGestureType.DIAGONAL_SWIPE
    default:
      return t
  }
}

export function typeWithoutOverReturn(t: TouchGestureType) {
  switch (t) {
    case TouchGestureType.CARDINAL_RETURN_OVER_SWIPE:
      return TouchGestureType.CARDINAL_RETURN_SWIPE
    case TouchGestureType.DIAGONAL_RETURN_OVER_SWIPE:
      return TouchGestureType.DIAGONAL_RETURN_SWIPE
    default:
      return t
  }
}

export class AbstractTouchGesture {
  protected _type: TouchGestureType
  protected _direction?: Direction
  protected _cornerDirection?: Direction
  private readonly _chainOnHold: boolean|null

  constructor(
    type: TouchGestureType,
    direction?: Direction,
    cornerDirection?: Direction,
    chainOnHold: boolean|null = true
  ) {
    // TODO could validate that type and direction match
    this._type = type
    this._direction = direction
    this._cornerDirection = cornerDirection
    this._chainOnHold = chainOnHold
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

  get chainOnHold() {
    return this._chainOnHold
  }

  equals(other: AbstractTouchGesture) {
    return (
      other._type === this._type
      && other._direction === this._direction
      && other._cornerDirection === this._cornerDirection
    )
  }

  get id(): string {
    return (
      `type=${this._type}`
      + (
        this.direction === undefined
        ? ''
        : (
          ` direction=`
          + (
            this._cornerDirection === undefined 
            ? this._direction 
            : `${this._direction}-${this._cornerDirection}`
          )
        )
      )
    )
  }

  get isHold() {
    return this._type.endsWith(TermGestureSegmentType.HOLD)
  }

  get isOverReturn() {
    return this._type.endsWith(TermGestureSegmentType.RETURN_OVER)
  }

  toString() {
    return (
      `TG[${this.id}]`
    )
  }
}

export default class TouchGesture extends AbstractTouchGesture {
  private _complete: boolean
  private onComplete?: (g: TouchGesture) => any
  private onSegment?: (s: InitGestureSegmentType, d: Direction) => any
  private _points: Group
  private times: Date[] = []
  private readonly segmentLength: number
  private readonly map: KeyMap
  private holdTimeout?: NodeJS.Timeout

  constructor(
    {type, direction, cornerDirection, origin, whenStart, segmentLength, map, onComplete, onSegment}: {
      type: TouchGestureType
      direction?: Direction
      cornerDirection?: Direction
      origin: IPt
      whenStart: Date
      segmentLength: number
      map: KeyMap
      onComplete?: (g: TouchGesture) => any
      onSegment?: (s: InitGestureSegmentType, d: Direction) => any
    }
  ) {
    super(type, direction, cornerDirection, null)
    this._complete = false
    this.onComplete = onComplete
    this.onSegment = onSegment
    this._points = new Group(new Pt(origin))
    this.times.push(whenStart)
    this.segmentLength = segmentLength
    this.map = map
    this.startHoldTimeout()

    if (type === TouchGestureType.TOUCH) {
      this.innerType = InitGestureSegmentType.TOUCH
    }
  }

  set innerType(type: InitGestureSegmentType) {
    if (this._type !== type as unknown as TouchGestureType) {
      this._type = (type as unknown as TouchGestureType)

      if (this.onSegment) {
        this.onSegment(type, this.direction!)
      }
    }
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

  public startHoldTimeout(delaySec = holdDelaySec) {
    this.clearHoldTimeout()

    this.holdTimeout = setTimeout(
      () => this.addHoldSegment(), 
      delaySec * 1000
    )
  }

  static create(e: TouchEvent|MouseEvent, segmentLength: number, map: KeyMap, onComplete?: (g: TouchGesture) => any, onSegment?: (s: InitGestureSegmentType, d: Direction) => any) {
    logger.info(`create gesture on event type=${e.type}`)

    return new TouchGesture({ 
      type: TouchGestureType.TOUCH,
      origin: {
        x: isTouch(e) ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX,
        y: isTouch(e) ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY
      },
      whenStart: new Date(),
      segmentLength,
      map,
      onComplete,
      onSegment
    })
  }

  addHoldSegment() {
    if (!this.complete) {
      if (!this.isHold) {
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
      }

      if (this.map.getAbstractGesture(this)!.chainOnHold) {
        if (this.onComplete) {
          this.onComplete(this)
        }
        this.startHoldTimeout(holdDelaySec * 0.3)
      }
      else {
        this.complete = true
      }
    }
  }

  update(e: TouchEvent|MouseEvent) {
    if (this._complete) return

    const p = new Pt({
      // touch coordinates are not defined for touchend
      x: isTouch(e) ? (e as TouchEvent).touches[0]?.clientX : (e as MouseEvent).clientX,
      y: isTouch(e) ? (e as TouchEvent).touches[0]?.clientY : (e as MouseEvent).clientY
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
            this.innerType = (
              isCardinal(dir) ? InitGestureSegmentType.CARDINAL_SWIPE : InitGestureSegmentType.DIAGONAL_SWIPE
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
}