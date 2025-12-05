import GridDimensions from "@lib/gridDimensions"
import KeyCell from "@component/keyCell"
import { KeyboardInstance } from "@lib/keyboardDefinition"
import { useContext, useEffect, useRef, useState } from "react"
import { KeyGridCtx } from "@context/keyGridCtx"
import { isTouchScreen } from "@lib/platform"
import { ConfigCtx } from "@context/configCtx"
import { listenerName } from "@lib/eventSync"
import { ConfigEvalMode } from "@lib/control"

const scrollEventTypes = ['scroll', 'touchmove', 'wheel', 'drag']

export default function KeyGrid(
  { keyboard, onClose, configurable }: {
    keyboard: KeyboardInstance
    onClose?: () => void
    configurable: boolean
  }
) {
  const grid = useRef(null as unknown as HTMLDivElement|null)
  const keyGridState = useContext(KeyGridCtx)
  const configCtx = useContext(ConfigCtx)
  const [dimensions, setDimensions] = useState(keyboard.keyboard.dimensions as GridDimensions|undefined)

  // read subsequent keyboard config updates
  useEffect(
    () => {
      if (!configCtx || !configurable) return

      const name = listenerName(KeyGrid.name)
      configCtx.addSaveListener(name, 'GridDimensions', () => {
        setDimensions(configCtx.keyboardInstance?.keyboard.dimensions)
      })
      
      return () => configCtx.deleteSaveListener(name, 'GridDimensions')
    },
    [ configCtx, configurable ]
  )

  const ignoreScroll = useRef(
    (e: Event) => { e.preventDefault() }
  )
  const unlockScroll = useRef(
    () => scrollEventTypes.forEach((eventType) => grid.current?.removeEventListener(eventType, ignoreScroll.current))
  )
  const lockScroll = useRef(() => {
    scrollEventTypes.forEach((eventType) => {
      grid.current?.addEventListener(
        eventType, 
        ignoreScroll.current,
        {
          passive: false
        }
      )
    })

    return unlockScroll
  })

  const relayMouseEvent = useRef(isTouchScreen() ? undefined : (e: MouseEvent) => {
    const _e = new MouseEvent(
      e.type,
      {
        clientX: e.clientX,
        clientY: e.clientY
      }
    )
    keyGridState?.mouseHoverKeyCell.current?.dispatchEvent(_e)
  })
  const disableMouseEvents = useRef(!relayMouseEvent ? undefined : () => {
    window.removeEventListener('mousemove', relayMouseEvent.current!)
    window.removeEventListener('mouseup', relayMouseEvent.current!)
  })
  const enableMouseEvents = useRef(!relayMouseEvent ? undefined : () => {
    window.addEventListener('mousemove', relayMouseEvent.current!)
    window.addEventListener('mouseup', relayMouseEvent.current!)

    return disableMouseEvents
  })

  const deactivate = useRef(undefined as unknown as (closeKeyboard: boolean) => void)
  const activate = useRef(() => {})
  useEffect(
    () => {
      if (!keyGridState) return

      // define deactivate
      deactivate.current = (closeKeyboard: boolean) => {
        unlockScroll.current()

        if (disableMouseEvents.current) {
          disableMouseEvents.current()
        }

        if (closeKeyboard && onClose) {
          onClose()

          keyGridState?.deactivateKeyGrid.delete(keyboard.instanceId)
        }
      }

      // define activate
      activate.current = () => {
        lockScroll.current()
        if (enableMouseEvents.current) {
          enableMouseEvents.current()
        }

        keyGridState.deactivateKeyGrid.set(keyboard.instanceId, deactivate.current)
      }
    },
    [ keyGridState, keyboard, onClose ]
  )

  function* getKeyCells() {
    const h = dimensions?.height || 0
    const w = dimensions?.width || 0

    for (let row=0; row < h; row++) {
      for (let col=0; col < w; col++) {
        yield (
          <KeyCell 
            key={`${row},${col}`}
            index={{ row, col }}
            keyGridOnClose={onClose}
            keyboard={keyboard} />
        )
      }
    }
  }

  // activate on keyboard assignment
  useEffect(
    () => {
      if (!keyGridState) return

      activate.current()

      return () => deactivate.current(false)
    },
    [ keyGridState, keyboard ]
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
            'h-full',
            'overflow-clip',
            `grid grid-rows-${dimensions?.height || 1} grid-cols-${dimensions?.width || 1} gap-1`
          ].join(' ')}>
          {Array.from(getKeyCells())}
        </div>
    </div>
  )
}
