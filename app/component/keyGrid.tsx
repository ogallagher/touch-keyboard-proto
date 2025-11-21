import GridDimensions from "@lib/gridDimensions"
import KeyCell from "./keyCell"
import KeyLabel from "@lib/keyLabel"
import KeyMap from "@lib/keyMap"
import { AbstractTouchGesture, TouchGestureType } from "@lib/touchGesture"
import KeyStroke from "@lib/keyStroke"

export default function KeyGrid(
  { dimensions }: {
    dimensions: GridDimensions
  }
) {
  function* getKeyCells(row: number) {
    for (let col=0; col<dimensions.width; col++) {
      const keystroke = new KeyStroke(String.fromCodePoint((
        'a'.charCodeAt(0) 
        + row*dimensions.height 
        + col*dimensions.width
      )))

      yield (
        <KeyCell 
          key={`${row},${col}`}
          label={new KeyLabel({ center: keystroke.toString() })}
          map={new KeyMap([
            [
              new AbstractTouchGesture(TouchGestureType.TOUCH), 
              keystroke
            ]
          ])} />
      )
    }
  }

  function* getKeyRows() {
    for (let row=0; row<dimensions.height; row++) {
      yield (
        <div
          key={row}
          className={`grow flex flex-row justify-evenly gap-1`}>
          {[...getKeyCells(row)]}
        </div>
      )
    }
  }

  return (
    <div
      className={[
        'font-mono',
        'grow flex flex-col justify-evenly gap-1'
      ].join(' ')}>
      {[...getKeyRows()]}
    </div>
  )
}