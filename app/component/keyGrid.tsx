import GridDimensions from "@lib/gridDimensions"
import KeyCell from "./keyCell"
import KeyboardDefinition from "@lib/keyboardDefinition"
import KeyLabel from "@lib/keyLabel"
import KeyMap from "@lib/keyMap"
import { useContext, useEffect, useRef } from "react"
import { KeyGridCtx } from "@context/keyGridCtx"
import { isTouchScreen } from "@lib/platform"

export default function KeyGrid(
  { dimensions, keyboard }: {
    dimensions: GridDimensions,
    keyboard: KeyboardDefinition
  }
) {
  const grid = useRef(null as unknown as HTMLDivElement)
  const keyGridState = useContext(KeyGridCtx)

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
            label={new KeyLabel()}
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

  // lock scroll
  useEffect(
    () => {
      const ignoreScroll = (e: Event) => { e.preventDefault() }
      const scrollEventTypes = ['scroll', 'touchmove', 'wheel', 'drag']

      scrollEventTypes.forEach((eventType) => {
        grid.current.addEventListener(
          eventType, 
          ignoreScroll
        )
      })

      // document.body.classList.add('overflow-hidden')

      return () => scrollEventTypes.forEach((eventType) => grid.current?.removeEventListener(eventType, ignoreScroll))
    },
    []
  )

  // mouse events that exit key cells
  useEffect(
    () => {
      if (!isTouchScreen()) {
        const relay = (e: MouseEvent) => {
          let _e = new MouseEvent(
            e.type,
            {
              clientX: e.clientX,
              clientY: e.clientY
            }
          )
          keyGridState.current?.mouseHoverKeyCell.current?.dispatchEvent(_e)
        }

        window.addEventListener('mousemove', relay)
        window.addEventListener('mouseup', relay)

        return () => {
          window.removeEventListener('mousemove', relay)
          window.removeEventListener('mouseup', relay)
        }
      }
    },
    []
  )

  return (
    <div
      ref={grid}
      className={[
        'font-mono',
        'grow flex flex-col justify-evenly gap-1'
      ].join(' ')}>
      {[...getKeyRows()]}
    </div>
  )
}