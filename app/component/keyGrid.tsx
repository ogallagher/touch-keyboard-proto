import GridDimensions from "@lib/gridDimensions"
import KeyCell from "./keyCell"
import KeyboardDefinition from "@lib/keyboardDefinition"
import KeyLabel from "@lib/keyLabel"
import KeyMap from "@lib/keyMap"

export default function KeyGrid(
  { dimensions, keyboard }: {
    dimensions: GridDimensions,
    keyboard: KeyboardDefinition
  }
) {
  function* getKeyCells(row: number) {
    for (let col=0; col<dimensions.width; col++) {
      if (row < keyboard.keys.length && col < keyboard.keys[row].length) {
        yield (
          <KeyCell 
            key={`${row},${col}`}
            label={keyboard.keys[row][col].label}
            map={keyboard.keys[row][col].map} />
        )
      }
      else {
        yield (
          <KeyCell 
            key={`${row},${col}`}
            label={new KeyLabel({ center: '' })}
            map={ new KeyMap() } />
        )
      }
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