import { ChildKeyboardConfig, ConfigCtx } from "@context/configCtx"
import { listenerName } from "@lib/eventSync"
import { KeyboardInstance, keyboardInstanceId, KeyIndex } from "@lib/keyboardDefinition"
import { KeyDefinition } from "@lib/keyDefinition"
import KeyLabel, { Zone } from "@lib/keyLabel"
import KeyMap from "@lib/keyMap"
import KeyStroke, { MetaChar } from "@lib/keyStroke"
import { AbstractTouchGesture } from "@lib/touchGesture"
import { ChangeEvent, Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react"
import GestureTypeLabel from "./gestureType"
import KeyZoneLabel from "@component/keyZoneLabel"
import { KeyGridCtx, ModifierKeyListener } from "@context/keyGridCtx"
import { ConfigEvalMode, ConfigSection } from "@lib/control"
import ConfigKeyMap from "./configKeyMap"

export default function ConfigKeyCell(
  { configSection }: {
    configSection: ConfigSection
  }
) {
  const configCtx = useContext(ConfigCtx)
  const gridCtx = useContext(KeyGridCtx)
  const keyIndex = useRef({row: -1, col: -1} as KeyIndex)
  const [keyLabel, setKeyLabel] = useState(undefined as KeyLabel|undefined)
  const keyMap = useRef(undefined as KeyMap|undefined)
  const [keyStroke, setKeyStroke] = useState(undefined as KeyStroke|undefined)
  const keyStrokeInput = useRef(null as unknown as HTMLInputElement)
  const [childKeyboardId, setChildKeyboardId] = useState(undefined as string|undefined)
  const [childKeyboardConfig, setChildKeyboardConfig] = useState(undefined as ChildKeyboardConfig|undefined)
  const [gesture, setGesture] = useState(undefined as AbstractTouchGesture|undefined)
  const [labelZoneUseGesture, setLabelZoneUseGesture] = useState(false)
  const [labelZoneUseModKeys, setLabelZoneUseModKeys] = useState(false)
  const [isShift, setIsShift] = useState(false)
  const [isCapsLock, setIsCapsLock] = useState(false)

  // read from config context with key load listener
  useEffect(
    () => {
      if (!configCtx) return

      const name = listenerName(ConfigKeyCell.name)
      configCtx.addLoadListener(name, () => {
        let key: KeyDefinition|undefined
        if (configCtx.keyboardInstance && configCtx.keyIndex) {
          keyIndex.current = configCtx.keyIndex
          key = configCtx.getKeyDefinition(configCtx.keyIndex)
        }

        setKeyLabel(key?.label)
        keyMap.current = key?.map
        setKeyStroke(configCtx.keystroke?.clone())
        setChildKeyboardId(configCtx.childKeyboardInstance?.instanceId)
        setChildKeyboardConfig(configCtx.childKeyboardInstance?.config)
        setGesture(configCtx.gesture?.clone())
      })

      return () => configCtx.deleteLoadListener(name)
      
    },
    [ configCtx ]
  )

  // listen to modifier keys
  useEffect(
    () => {
      if (!gridCtx) return

      const mkeyListeners: [Set<ModifierKeyListener>, Dispatch<SetStateAction<boolean>>][] = []

      gridCtx.shiftListeners.add(setIsShift)
      mkeyListeners.push([gridCtx.shiftListeners, setIsShift])

      gridCtx.capsLockListeners.add(setIsCapsLock)
      mkeyListeners.push([gridCtx.capsLockListeners, setIsCapsLock])

      return () => { 
        mkeyListeners.forEach(([ls, l]) => ls.delete(l))
      }
    },
    [ gridCtx ]
  )

  // write to config context
  useEffect(
    () => {
      if (!gridCtx || !configCtx || configCtx.mode !== ConfigEvalMode.Config) return

      if (keyLabel && keyMap.current) {
        // don't update keyMap ref directly; delegate to configCtx in order to notify listeners
        const newKeyMap = keyMap.current.clone(false)
        if (gesture) {
          const oldMapValue = keyMap.current.getKeys(gesture, false, false)
          if (childKeyboardId) {
            let childKeyboard = gridCtx.getKeyboard(childKeyboardId)
            if (!(oldMapValue instanceof KeyboardInstance && oldMapValue.instanceId === childKeyboardId)) {
              // if not already child of this keyboard, clone and adopt as separate instance
              if (!childKeyboard) {
                console.error(`cannot map to missing keyboard instance id=${childKeyboardId} for gesture=${gesture}`)
              }
              else if (!configCtx.keyboardInstance) {
                console.error(`cannot map gesture=${gesture} to child keyboard without parent instance id`)
              }
              else {              
                if (childKeyboard.parentInstanceId !== configCtx.keyboardInstance.instanceId) {
                  childKeyboard = childKeyboard.clone({ 
                    parentInstanceId: configCtx.keyboardInstance.instanceId,
                    instanceId: keyboardInstanceId(childKeyboard.keyboard.name)
                  })
                  gridCtx.addKeyboard(childKeyboard)
                  // instead of setting state for new child keyboard, read from configCtx
                }

                newKeyMap.set(gesture, childKeyboard)
              }
            }
            // else, keyMap value for current gesture is already set to this child keyboard

            // update child keyboard config
            if (childKeyboardConfig && childKeyboard) {
              childKeyboard.config = childKeyboardConfig
            }
          }
          else {
            newKeyMap.set(gesture, keyStroke)
          }
        }

        const keyDef = new KeyDefinition({ label: keyLabel, map: newKeyMap })
        if (!keyDef.equals(configCtx.getKeyDefinition(keyIndex.current)!)) {
          configCtx.setKey(keyIndex.current, keyDef)
        }
      }
    },
    [ gridCtx, configCtx, gesture, keyLabel, keyStroke, childKeyboardId, childKeyboardConfig ]
  )

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

  // reset on close config mode
  useEffect(
    () => {
      if (!configCtx) return

      const name = listenerName(ConfigKeyCell.name)
      configCtx.addModeListener(name, () => {
        if (configCtx.mode !== ConfigEvalMode.Config) {
          configCtx.unloadKey()
        }
      })

      return () => configCtx.deleteModeListener(name)
    },
    [ configCtx ]
  )

  const onMajRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsShift(e.target.value === MetaChar.SHIFT)
    setIsCapsLock(e.target.value === MetaChar.CAPS_LOCK)
  }
  
  return (
    <div
      className={[
        'flex-col justify-between gap-1 max-h-50 sm:max-h-70 overflow-y-auto',
        // avoid vertical scroll bar if y-overflow to prevent x-overflow
        'pr-3',
        (configSection === 'key' ? 'flex' : 'hidden')
      ].join(' ')} >
      <div className='flex flex-row grow gap-2'>
        {/* key label pseudozone use gesture */}
        <div className='flex flex-row gap-1 justify-start text-sm'>
          <input
            type='checkbox'
            id='labelZoneUseGesture'
            className='cursor-pointer my-auto flex-none'
            checked={labelZoneUseGesture}
            onChange={e => setLabelZoneUseGesture(e.target.checked)} />

          <label htmlFor='labelZoneUseGesture' className='my-auto' >
            Use gesture start segment as label condition
          </label>
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
            className='cursor-pointer my-auto flex-none'
            checked={labelZoneUseModKeys}
            onChange={e => setLabelZoneUseModKeys(e.target.checked)} />

          <label htmlFor='labelZoneUseModKeys' className='my-auto' >
            Use modifier keys as label condition
          </label>
        </div>

        {/* modifier key controls */}
        <div className='flex flex-row gap-1 justify-start' title='shift'>
          <input 
            type='radio'
            name='modKeysMaj'
            id={`modKeysMaj-${MetaChar.SHIFT}`}
            value={MetaChar.SHIFT}
            className='cursor-pointer my-auto'
            checked={isShift}
            onChange={onMajRadioChange} />

          <label 
            htmlFor={`modKeysMaj-${MetaChar.SHIFT}`} 
            className='my-auto text-md' >
            ⇧
          </label>
        </div>
        <div className='flex flex-row gap-1 justify-start' title='caps-lock'>
          <input 
            type='radio'
            name='modKeysMaj'
            id={`modKeysMaj-${MetaChar.CAPS_LOCK}`}
            value={MetaChar.CAPS_LOCK}
            className='cursor-pointer my-auto'
            checked={isCapsLock}
            onChange={onMajRadioChange} />

          <label 
            htmlFor={`modKeysMaj-${MetaChar.CAPS_LOCK}`} 
            className='my-auto text-2xl' >
              ⇪
          </label>
        </div>
        <input 
            title='none'
            type='radio'
            name='modKeysMaj'
            id={`modKeysMaj-none`}
            value={''}
            className='cursor-pointer my-auto'
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
      <ConfigKeyMap
        keyboardInstance={configCtx?.keyboardInstance}
        keyMap={keyMap}
        keyStroke={keyStroke} setKeyStroke={setKeyStroke}
        keyStrokeInput={keyStrokeInput}
        childKeyboardId={childKeyboardId} setChildKeyboardId={setChildKeyboardId}
        childKeyboardConfig={childKeyboardConfig} setChildKeyboardConfig={setChildKeyboardConfig} />
      
    </div>
  )
}