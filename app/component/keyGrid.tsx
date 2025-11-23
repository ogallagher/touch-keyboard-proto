import GridDimensions from "@lib/gridDimensions"
import KeyCell from "./keyCell"
import KeyboardDefinition from "@lib/keyboardDefinition"
import KeyLabel, { ZoneKey } from "@lib/keyLabel"
import KeyMap from "@lib/keyMap"
import { useContext, useEffect, useRef, useState } from "react"
import { KeyGridCtx } from "@context/keyGridCtx"
import { isTouchScreen } from "@lib/platform"

export default function KeyGrid(
  { dimensions, keyboard, onClose }: {
    dimensions: GridDimensions
    keyboard: KeyboardDefinition
    onClose?: () => void
  }
) {
  const grid = useRef(null as unknown as HTMLDivElement)
  const [active, setActive] = useState(true)
  const keyGridState = useContext(KeyGridCtx)

  const lockScroll = () => {
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
  }

  const enableMouseEvents = () => {
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
  }

  const activate = useRef(() => {
    setActive(true)
    const unlockScroll = lockScroll()
    const disableMouseEvents = enableMouseEvents()

    return (closeKeyboard: boolean = false) => { 
      setActive(false)
      unlockScroll()

      if (disableMouseEvents) {
        disableMouseEvents()
      }

      if (closeKeyboard && onClose) {
        onClose()
      }
    }
  })

  function* getKeyCells(row: number) {
    for (let col=0; col<dimensions.width; col++) {
      let label: KeyLabel
      let map: KeyMap
      const dim = keyboard.dimensions
      if (row < dim.height && col < dim.width) {
        label = keyboard.getKey(row, col).label
        map = keyboard.getKey(row, col).map
      }
      else {
        label = new KeyLabel([[new ZoneKey('center'), ' ']])
        map = new KeyMap()
      }

      yield (
        <KeyCell 
          key={`${row},${col}`}
          label={label}
          map={map}
          activateKeyGrid={activate} />
      )
    }
  }

  function* getKeyRows() {
    for (let row=0; row<dimensions.height; row++) {
      yield (
        <div
          key={row}
          className='grow flex flex-row justify-evenly gap-1'>
          {[...getKeyCells(row)]}
        </div>
      )
    }
  }

  // activate
  useEffect(
    () => {
      const deactivate = activate.current()

      keyGridState.current.deactivateKeyGrid.current = deactivate

      return deactivate
    },
    []
  )

  return (
    <div 
      className={[
        'top-0 left-0 right-0 bottom-0',
        active ? 'absolute' : 'hidden'
      ].join(' ')} >
        <div
          ref={grid}
          className={[
            'font-mono',
            'grow flex h-full flex-col justify-evenly gap-1'
          ].join(' ')}>
          {[...getKeyRows()]}
        </div>
    </div>
  )
}
