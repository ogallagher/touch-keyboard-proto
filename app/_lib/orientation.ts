export enum Orientation {
  Horizontal = 'h',
  Vertical = 'v'
}

export enum Cardinal {
  UP = 'u',
  RIGHT = 'r',
  DOWN = 'd',
  LEFT = 'l'
}

export enum Diagonal {
  UPRIGHT = 'ur',
  DOWNRIGHT = 'dr',
  DOWNLEFT = 'dl',
  UPLEFT = 'ul'
}

export enum Direction {
  UP = Cardinal.UP,
  RIGHT = Cardinal.RIGHT,
  DOWN = Cardinal.DOWN,
  LEFT = Cardinal.LEFT,
  
  UPRIGHT = Diagonal.UPRIGHT,
  DOWNRIGHT = Diagonal.DOWNRIGHT,
  DOWNLEFT = Diagonal.DOWNLEFT,
  UPLEFT = Diagonal.UPLEFT
}

export const isCardinal = (d: Direction) => d.length == 1

export const isDiagonal = (d: Direction) => d.length == 2

export function headingToDirection(heading: number): Direction {
  const _2pi = Math.PI * 2
  const directionCone = Math.PI / 4
  const directionBisectOffset = directionCone / 2

  // constrain heading to [0, 2pi]
  while (heading < 0) {
    heading += _2pi
  }
  while (heading > _2pi) {
    heading -= _2pi
  }

  if (heading < directionCone - directionBisectOffset) {
    return Direction.RIGHT
  }
  else if (heading > _2pi - directionCone + directionBisectOffset) {
    return Direction.RIGHT
  }
  else if (heading < 2*directionCone - directionBisectOffset) {
    return Direction.DOWNRIGHT
  }
  else if (heading < 3*directionCone - directionBisectOffset) {
    return Direction.DOWN
  }
  else if (heading < Math.PI - directionBisectOffset) {
    return Direction.DOWNLEFT
  }
  else if (heading < Math.PI + directionCone - directionBisectOffset) {
    return Direction.LEFT
  }
  else if (heading < 6*directionCone - directionBisectOffset) {
    return Direction.UPLEFT
  }
  else if (heading < _2pi - directionCone - directionBisectOffset) {
    return Direction.UP
  }
  else {
    return Direction.UPRIGHT
  }
}

export function toOpposite(d: Direction|Cardinal|Diagonal) {
  switch (d) {
    case Direction.UP:
      return Direction.DOWN
    case Direction.RIGHT:
      return Direction.LEFT
    case Direction.DOWN:
      return Direction.UP
    case Direction.LEFT:
      return Direction.RIGHT
    
    case Direction.UPRIGHT:
      return Direction.DOWNLEFT
    case Direction.DOWNRIGHT:
      return Direction.UPLEFT
    case Direction.DOWNLEFT:
      return Direction.UPRIGHT
    case Direction.UPLEFT:
      return Direction.DOWNRIGHT

    default:
      throw new Error(`cannot determine opposite of unknown direction=${d}`)
  }
}

export const isPerpendicular = (d1: Cardinal, d2: Direction) => isCardinal(d2) && toOpposite(d1) !== d2

export function isAcute(d1: Diagonal, d2: Direction) {
  switch (d1) {
    case Diagonal.UPRIGHT:
      return d2 === Direction.LEFT || d2 === Direction.DOWN
    case Diagonal.DOWNRIGHT:
      return d2 === Direction.UP || d2 === Direction.LEFT
    case Diagonal.DOWNLEFT:
      return d2 === Direction.RIGHT || d2 === Direction.UP
    case Diagonal.UPLEFT:
      return d2 === Direction.DOWN || d2 === Direction.RIGHT
  }
}
