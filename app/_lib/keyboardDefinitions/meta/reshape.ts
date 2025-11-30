import KeyboardDefinition from "@lib/keyboardDefinition";
import { KeyDefinition } from "@lib/keyDefinition";
import KeyLabel from "@lib/keyLabel";
import KeyMap from "@lib/keyMap";

/**
 * Reshape the keys grid of an existing keyboard definition.
 * 
 * @param keyboard 
 * @param dimensions 
 * @returns 
 */
export function getReshapedKeyboard(
  keyboard: KeyboardDefinition, 
  {width, height}: {
    width?: number 
    height?: number
  }
) {
  const oldDims = keyboard.dimensions
  const keysFlat = keyboard.allKeys()

  let shiftCount: number
  let _width: number, _height: number
  if (width === undefined && height !== undefined) {
    // derive width from height
    shiftCount = keysFlat.length - (oldDims.width * height)
    _width = oldDims.width + Math.ceil(shiftCount / height)
    _height = height
  }
  else if (width !== undefined && height === undefined) {
    // derive height from width
    shiftCount = keysFlat.length - (oldDims.height * width)
    _height = oldDims.height + Math.ceil(shiftCount / width)
    _width = width
  }
  else if (width === undefined && height === undefined) {
    throw new Error(`cannot reshape keyboard name=${keyboard.name} without width or height`)
  }
  else {
    _width = width!
    _height = height!
  }

  const keysGrid: KeyDefinition[][] = (
    Array.from(new Array(_height))
    .map(() => new Array(_width))
  )

  let r=0, c=0
  for (let i=0; i < _height * _width; i++) {
    keysGrid[r][c] = keysFlat[i] || new KeyDefinition({ label: new KeyLabel(), map: new KeyMap() })

    c++
    if (c >= _width) {
      c=0
      r++
    }
  }

  return new KeyboardDefinition(keyboard.name, keysGrid)
}