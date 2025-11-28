import GridDimensions from "@lib/gridDimensions"
import KeyCell from "@component/keyCell"
import { KeyboardInstance, KeyboardPersistance } from "@lib/keyboardDefinition"
import { useContext, useEffect, useRef, useState } from "react"
import { KeyGridCtx } from "@context/keyGridCtx"
import { isTouchScreen } from "@lib/platform"
import { ConfigCtx } from "@context/configCtx"
import { listenerName } from "@lib/eventSync"
import { ConfigEvalMode } from "@lib/control"

const scrollEventTypes = ['scroll', 'touchmove', 'wheel', 'drag']

export default function KeyGrid(
  { keyboard, persistance = KeyboardPersistance.Indefinite, onClose, configurable }: {
    keyboard: KeyboardInstance
    persistance?: KeyboardPersistance
    onClose?: () => void
    configurable: boolean
  }
) {
  const grid = useRef(null as unknown as HTMLDivElement)
  const keyGridState = useContext(KeyGridCtx)
  const configCtx = useContext(ConfigCtx)
  const [dimensions, setDimensions] = useState(keyboard.keyboard.dimensions as GridDimensions|undefined)

  // read subsequent keyboard config updates
  useEffect(
    () => {
      if (configCtx && configurable) {
        const name = listenerName(KeyGrid.name)
        configCtx.addSaveListener(name, GridDimensions.name, () => {
          setDimensions(configCtx.keyboardInstance?.keyboard.dimensions)
        })
        
        return () => configCtx.deleteSaveListener(name, GridDimensions.name)  
      }
    },
    [ configCtx, configurable ]
  )

  // TODO define all of these methods once with useRef
  const ignoreScroll = (e: Event) => { e.preventDefault() }
  const unlockScroll = () => scrollEventTypes.forEach((eventType) => grid.current?.removeEventListener(eventType, ignoreScroll))
  const lockScroll = () => {
    scrollEventTypes.forEach((eventType) => {
      grid.current.addEventListener(
        eventType, 
        ignoreScroll
      )
    })

    return unlockScroll
  }

  const relayMouseEvent = isTouchScreen() ? undefined : (e: MouseEvent) => {
    const _e = new MouseEvent(
      e.type,
      {
        clientX: e.clientX,
        clientY: e.clientY
      }
    )
    keyGridState?.mouseHoverKeyCell.current?.dispatchEvent(_e)
  }
  const disableMouseEvents = !relayMouseEvent ? undefined : () => {
    window.removeEventListener('mousemove', relayMouseEvent)
    window.removeEventListener('mouseup', relayMouseEvent)
  }
  const enableMouseEvents = !relayMouseEvent ? undefined : () => {
    window.addEventListener('mousemove', relayMouseEvent)
    window.addEventListener('mouseup', relayMouseEvent)

    return disableMouseEvents
  }

  const deactivate = useRef((closeKeyboard: boolean) => {
    unlockScroll()

    if (disableMouseEvents) {
      disableMouseEvents()
    }

    if (closeKeyboard && onClose) {
      onClose()
    }
  })
  const activate = useRef(() => {
    lockScroll()
    if (enableMouseEvents) {
      enableMouseEvents!()
    }

    return deactivate.current
  })

  function* getKeyCells(row: number) {
    const w = dimensions?.width || 0

    for (let col=0; col < w; col++) {
      yield (
        <KeyCell 
          key={`${row},${col}`}
          index={{ row, col }}
          activateKeyGrid={activate}
          keyboard={keyboard} />
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
      if (!keyGridState) {
        return
      }

      const deactivate = activate.current()

      keyGridState.deactivateKeyGrid.current = deactivate
      keyGridState.gridPersistance.current = persistance

      return () => deactivate(false)
    },
    [ keyGridState, persistance ]
  )

  // deactivate on mode=config if not configurable
  useEffect(
    () => {
      if (configCtx && !configurable) {
        const name = listenerName(KeyGrid.name)
        configCtx.addModeListener(name, () => {
          if (configCtx.mode === ConfigEvalMode.Config) {
            deactivate.current(true)
          }
        })

        return () => configCtx.deleteModeListener(name)
      }
    },
    [ configCtx, configurable ]
  )

  return (
    <div 
      className={[
        'top-0 left-0 right-0 bottom-0',
        'absolute'
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
