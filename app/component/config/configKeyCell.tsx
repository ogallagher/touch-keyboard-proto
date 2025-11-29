import { ConfigCtx } from "@context/configCtx"
import { listenerName } from "@lib/eventSync"
import { KeyIndex } from "@lib/keyboardDefinition"
import { KeyDefinition } from "@lib/keyDefinition"
import KeyLabel, { Zone } from "@lib/keyLabel"
import KeyMap from "@lib/keyMap"
import KeyStroke, { MetaChar } from "@lib/keyStroke"
import { AbstractTouchGesture } from "@lib/touchGesture"
import { ChangeEvent, Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react"
import GestureTypeLabel from "./gestureType"
import KeyZoneLabel from "@component/keyZoneLabel"
import { KeyGridCtx, ModifierKeyListener } from "@context/keyGridCtx"
import MetaCharControl from "@component/metaChar"

export default function ConfigKeyCell() {
  const configCtx = useContext(ConfigCtx)
  const gridCtx = useContext(KeyGridCtx)
  const keyIndex = useRef({row: -1, col: -1} as KeyIndex)
  const [keyLabel, setKeyLabel] = useState(undefined as KeyLabel|undefined)
  const keyMap = useRef(undefined as KeyMap|undefined)
  const [keyStroke, setKeyStroke] = useState(undefined as KeyStroke|undefined)
  const keyStrokeInput = useRef(null as unknown as HTMLInputElement)
  const [gesture, setGesture] = useState(undefined as AbstractTouchGesture|undefined)
  const [labelZoneUseGesture, setLabelZoneUseGesture] = useState(false)
  const [labelZoneUseModKeys, setLabelZoneUseModKeys] = useState(false)
  const [isShift, setIsShift] = useState(false)
  const [isCapsLock, setIsCapsLock] = useState(false)

  // init on new config context
  useEffect(
    () => {
      if (configCtx) {
        const name = listenerName(ConfigKeyCell.name)
        configCtx.addLoadListener(name, () => {
          let key: KeyDefinition|undefined
          if (configCtx.keyboardInstance && configCtx.keyIndex) {
            keyIndex.current = configCtx.keyIndex
            key = configCtx.keyboardInstance.keyboard.getKey(configCtx.keyIndex.row, configCtx.keyIndex.col)
          }

          setKeyLabel(key?.label)
          keyMap.current = key?.map
          setKeyStroke(configCtx.keystroke?.clone())
          setGesture(configCtx.gesture?.clone())
        })

        return () => configCtx.deleteLoadListener(name)
      }
    },
    [ configCtx ]
  )

  // listen to modifier keys
  useEffect(
    () => {
      if (gridCtx) {
        const mkeyListeners: [Set<ModifierKeyListener>, Dispatch<SetStateAction<boolean>>][] = []

        gridCtx.shiftListeners.add(setIsShift)
        mkeyListeners.push([gridCtx.shiftListeners, setIsShift])

        gridCtx.capsLockListeners.add(setIsCapsLock)
        mkeyListeners.push([gridCtx.capsLockListeners, setIsCapsLock])

        return () => { 
          mkeyListeners.forEach(([ls, l]) => ls.delete(l))
        }
      }
    },
    [ gridCtx ]
  )

  // write to config context
  useEffect(
    () => {
      if (configCtx) {
        if (keyLabel && keyMap.current) {
          if (gesture) {
            keyMap.current.set(gesture, keyStroke)
          }

          const keyDef = new KeyDefinition({ label: keyLabel, map: keyMap.current })
          if (!keyDef.equals(configCtx.getKeyDefinition(keyIndex.current)!)) {
            configCtx.setKey(keyIndex.current, keyDef)
          }
        }
      }
    },
    [ configCtx, gesture, keyLabel, keyStroke ]
  )

  const onMajRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsShift(e.target.value === MetaChar.SHIFT)
    setIsCapsLock(e.target.value === MetaChar.CAPS_LOCK)
  }

  // write modifier keys to grid context
  useEffect(
    () => {
      if (!gridCtx) return

      const presses = [] as MetaChar[]
      const releases = [] as MetaChar[]

      (isShift ? presses : releases).push(MetaChar.SHIFT);
      (isCapsLock ? presses : releases).push(MetaChar.CAPS_LOCK)

      gridCtx.pressModifierKeys(...presses)
      gridCtx.releaseModifierKeys(...releases)
    },
    [ gridCtx, isShift, isCapsLock ]
  )
  
  return (
    <div
      className='flex flex-col justify-between gap-1' >
      <div className='flex flex-row gap-2 justify-between'>
        {/* key label pseudozone use gesture */}
        <div className='flex flex-row gap-1 justify-start text-sm'>
          <input
            type='checkbox'
            id='labelZoneUseGesture'
            className='cursor-pointer'
            checked={labelZoneUseGesture}
            onChange={e => setLabelZoneUseGesture(e.target.checked)} />

          <div className='flex flex-col justify-center'>
            <label htmlFor='labelZoneUseGesture' >
              Use gesture start segment as label condition
            </label>
          </div>
        </div>
        
        <div
          className='flex flex-row gap-1 justify-center text-7xl' >
          {/* gesture init segment */}
          <GestureTypeLabel
            gesture={
              !gesture ? undefined
              : new AbstractTouchGesture(gesture.initType, gesture.direction)
            } />
          {/* gesture */}
          <GestureTypeLabel gesture={gesture} />
        </div>
      </div>
      
      
      <div className='flex flex-row gap-4 justify-between'>   
        {/* key label pseudozone use modifier keys */}   
        <div
          className='flex flex-row gap-2 justify-start text-sm'>
          <input 
            type='checkbox'
            id='labelZoneUseModKeys'
            className='cursor-pointer'
            checked={labelZoneUseModKeys}
            onChange={e => setLabelZoneUseModKeys(e.target.checked)} />

          <div className='flex flex-col justify-center'>
            <label htmlFor='labelZoneUseModKeys' >
              Use modifier keys as label condition
            </label>
          </div>
        </div>

        {/* modifier key controls */}
        <div className='flex flex-row gap-1 justify-start' title='shift'>
          <input 
            type='radio'
            name='modKeysMaj'
            id={`modKeysMaj-${MetaChar.SHIFT}`}
            value={MetaChar.SHIFT}
            className='cursor-pointer'
            checked={isShift}
            onChange={onMajRadioChange} />

          <div className='flex flex-col justify-center'>
            <label htmlFor={`modKeysMaj-${MetaChar.SHIFT}`} >
              ⇧
            </label>
          </div>
          
        </div>
        <div className='flex flex-row gap-1 justify-start' title='caps-lock'>
          <input 
            type='radio'
            name='modKeysMaj'
            id={`modKeysMaj-${MetaChar.CAPS_LOCK}`}
            value={MetaChar.CAPS_LOCK}
            className='cursor-pointer'
            checked={isCapsLock}
            onChange={onMajRadioChange} />

          <div className='flex flex-col justify-center'>
            <label htmlFor={`modKeysMaj-${MetaChar.CAPS_LOCK}`} >
              ⇪
            </label>
          </div>
        </div>
        <input 
            title='none'
            type='radio'
            name='modKeysMaj'
            id={`modKeysMaj-none`}
            value={''}
            className='cursor-pointer'
            checked={!isShift && !isCapsLock}
            onChange={onMajRadioChange} />
      </div>

      {/* key label */}
      <div
        className='grid grid-cols-3 gap-1 text-xl' >
        {(['upleft', 'up', 'upright', 'left', 'center', 'right', 'downleft', 'down', 'downright'] as Zone[]).map(
          (zone) => (
            <div key={`wrap-${zone}`} className='dark:bg-zinc-700 bg-zinc-300 rounded-lg'>
              <KeyZoneLabel 
                key={zone} 
                zone={zone} label={keyLabel} 
                isShift={labelZoneUseModKeys && isShift} isCapsLock={labelZoneUseModKeys && isCapsLock} 
                gestureSegment={
                  labelZoneUseGesture 
                  ? { segment: gesture?.initType, direction: gesture?.direction } 
                  : undefined
                }
                setKeyLabel={keyLabel ? setKeyLabel : undefined} />
            </div>
          )
        )}
      </div>

      {/* key map */}
      <div
        className='flex flex-row justify-start gap-2' >
        <label className='text-lg' htmlFor='keyStroke'>keystroke:</label>
        <input 
          ref={keyStrokeInput}
          className='field-sizing-content min-w-8 text-base font-mono dark:bg-zinc-700 bg-zinc-300 rounded-md p-1'
          id='keyStroke'
          value={keyStroke?.toChars().join('') || ''}
          placeholder='none'
          disabled={keyMap === undefined}
          onChange={e => {
            setKeyStroke(KeyStroke.parse(e.target.value))}
          } />
        <div
          className='flex flex-row flex-wrap gap-1 text-base'>
          {
            // subset of meta chars that are currently supported for keystrokes
            [
              MetaChar.SHIFT, MetaChar.CAPS_LOCK,
              MetaChar.BACKSPACE, 
              MetaChar.UP, MetaChar.RIGHT, MetaChar.DOWN, MetaChar.LEFT,
            ].map(metaChar => 
              <MetaCharControl 
                key={metaChar}
                metaChar={metaChar} 
                keystroke={keyStroke} 
                setKeystrokeInput={v => {
                  setKeyStroke(KeyStroke.parse(v))
                }} />
            )
          }
        </div>
      </div>
    </div>
  )
}