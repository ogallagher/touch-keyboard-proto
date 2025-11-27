import GridDimensions from "@lib/gridDimensions"
import KeyCell from "@component/keyCell"
import { KeyboardInstance, KeyboardPersistance } from "@lib/keyboardDefinition"
import KeyLabel from "@lib/keyLabel"
import KeyMap from "@lib/keyMap"
import { useContext, useEffect, useRef, useState } from "react"
import { KeyGridCtx } from "@context/keyGridCtx"
import { isTouchScreen } from "@lib/platform"
import { ConfigCtx, configListenerName } from "@context/configCtx"

export default function KeyGrid(
  { keyboard, persistance = KeyboardPersistance.Indefinite, onClose, configurable }: {
    keyboard: KeyboardInstance
    persistance?: KeyboardPersistance
    onClose?: () => void
    configurable: boolean
  }
) {
  const grid = useRef(null as unknown as HTMLDivElement)
  const [active, setActive] = useState(true)
  const keyGridState = useContext(KeyGridCtx)
  const configCtx = useContext(ConfigCtx)
  const [dimensions, setDimensions] = useState(keyboard.keyboard.dimensions as GridDimensions|undefined)

  // read subsequent keyboard config updates
  useEffect(
    () => {
      if (configurable) {
        const name = configListenerName(KeyGrid.name)
        configCtx.addSaveListener(name, GridDimensions.name, () => {
          setDimensions(configCtx.keyboardInstance?.keyboard.dimensions)
        })
        
        return () => configCtx.deleteSaveListener(name, GridDimensions.name)  
      }
    },
    [ configurable ]
  )

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
        const _e = new MouseEvent(
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

    return (closeKeyboard: boolean) => { 
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
    const w = dimensions?.width || 0
    const h = dimensions?.height || 0

    for (let col=0; col < w; col++) {
      yield (
        <KeyCell 
          key={`${row},${col}`}
          index={{ row, col }}
          activateKeyGrid={activate} />
      )
    }
  }

  function* getKeyRows() {
    for (let row=0; row < (dimensions?.height || 0); row++) {
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
      keyGridState.current.gridPersistance.current = persistance

      return () => deactivate(false)
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
