import MetaCharControl from "@component/metaChar"
import { ChildKeyboardConfig, ConfigCtx } from "@context/configCtx"
import { KeyGridCtx } from "@context/keyGridCtx"
import { ConfigEvalMode } from "@lib/control"
import { listenerName } from "@lib/eventSync"
import { KeyboardInstance, keyboardInstanceId, KeyboardPersistence, KeyboardSize } from "@lib/keyboardDefinition"
import { switchKeyboardName } from "@lib/keyboardDefinitions/meta/switchKeyboard"
import KeyMap, { KeyMapValuetype } from "@lib/keyMap"
import KeyStroke, { MetaChar } from "@lib/keyStroke"
import { ChangeEvent, Dispatch, RefObject, SetStateAction, useContext, useEffect, useState } from "react"
import { ArrowsFullscreen, BoxArrowUpRight, Cursor, CursorFill, ExclamationCircle, Fullscreen, HourglassBottom, Infinity, Keyboard, KeyboardFill, Pip, PipFill, XCircle } from "react-bootstrap-icons"

export default function ConfigKeyMap(
  { 
    keyboardInstance, keyMap,
    keyStroke, setKeyStroke, keyStrokeInput, 
    childKeyboardId, setChildKeyboardId,
    childKeyboardConfig, setChildKeyboardConfig
  }: {
    keyboardInstance: KeyboardInstance|undefined
    keyMap: RefObject<KeyMap|undefined>
    keyStroke: KeyStroke|undefined
    setKeyStroke: Dispatch<SetStateAction<KeyStroke|undefined>>
    keyStrokeInput: RefObject<HTMLInputElement>
    childKeyboardId: string|undefined
    setChildKeyboardId: Dispatch<SetStateAction<string|undefined>>
    childKeyboardConfig: ChildKeyboardConfig|undefined
    setChildKeyboardConfig: Dispatch<SetStateAction<ChildKeyboardConfig|undefined>>
  }
) {
  const gridCtx = useContext(KeyGridCtx)
  const configCtx = useContext(ConfigCtx)
  const [mapControlsShow, setMapControlsShow] = useState(KeyMapValuetype.Keystroke)
  const [allKeyboardIds, setAllKeyboardIds] = useState([] as string[])

  // listen to session keyboards list
  useEffect(
    () => {
      if (!gridCtx) return

      const name = listenerName(ConfigKeyMap.name)
      gridCtx.keyboardsListListeners.set(name, () => {
        // update list
        setAllKeyboardIds(
          gridCtx.keyboardIds.filter(kbId => kbId !== switchKeyboardName)
          .concat(gridCtx.childKeyboardIds)
        )
      })

      return () => { gridCtx.keyboardsListListeners.delete(name) }
    },
    [ gridCtx ]
  )

  const onChildKeyboardChoice = (e: ChangeEvent<HTMLInputElement>) => {
    if (!gridCtx || !configCtx || !keyMap.current || !configCtx.gesture) return

    // set child keyboard, unset keystroke as mutually exclusive
    const childOriginKeyboardId = e.target.value
    
    let childKeyboard = gridCtx.getKeyboard(childOriginKeyboardId)
    if (!childKeyboard) {
      console.error(`cannot map to clone of missing keyboard instance id=${childOriginKeyboardId}`)
      return
    }
    if (!keyboardInstance) {
      console.error(`cannot map gesture to child keyboard without parent instance id`)
      return
    }
    
    // if not already child of this keyboard, clone and adopt as separate instance
    if (childKeyboard.parentInstanceId !== keyboardInstance.instanceId) {
      childKeyboard = childKeyboard.clone({ 
        parentInstanceId: keyboardInstance.instanceId,
        instanceId: keyboardInstanceId(childKeyboard.keyboard.name)
      })
      gridCtx.addKeyboard(childKeyboard)
    }

    // keyMap is updated by configKeyCell, where we determine whether keyDefinition changed for submit to configCtx

    setChildKeyboardId(childKeyboard.instanceId)
    setKeyStroke(undefined)
    setChildKeyboardConfig(childKeyboard.config)
  }

  const getKeyboardLineage = (kbid?: string) => {
    const keyboardInstance = kbid !== undefined ? gridCtx?.getKeyboard(kbid) : undefined
    const res = {
      instance: keyboardInstance,
      familyName: keyboardInstance?.keyboard.name
    } as {
      instance?: KeyboardInstance
      familyName?: string,
      parentInstanceId?: string
    }
    if (!keyboardInstance) return res

    if (keyboardInstance.parentInstanceId) {
      res.parentInstanceId = keyboardInstance.parentInstanceId
      const parentInstance = gridCtx?.getKeyboard(keyboardInstance.parentInstanceId)

      if (parentInstance) {
        res.familyName = `${parentInstance.keyboard.name}.${keyboardInstance.keyboard.name}`
      }
      else {
        console.error(`failed to get parent keyboard instance id=${keyboardInstance.parentInstanceId}`)
      }
    }
    
    return res
  }

  const launchChildKeyboard = () => {
    const childKeyboard = gridCtx?.getKeyboard(childKeyboardId!)
    if (!gridCtx || !childKeyboard) return

    gridCtx.addKeyGrid(
      childKeyboard, 
      true,
      () => {
        if (keyboardInstance) {
          gridCtx.addKeyGrid(
            keyboardInstance, 
            true, 
            () => {
              const deactivate = gridCtx.deactivateKeyGrid.get(keyboardInstance.instanceId)
              if (deactivate) {
                deactivate(true)
              }
            }
          )
        }
      }
    )
    configCtx?.setMode(ConfigEvalMode.Eval)
  }

  const deleteChildKeyboard = (kbid: string) => {
    gridCtx?.deleteKeyboard(kbid)

    // grid ctx will not sync config ctx automatically, so we update config accordingly
    if (childKeyboardId === kbid) {
      setChildKeyboardId(undefined)
    }
  }

  const setChildKeyboardConfigWrapper = (size?: KeyboardSize, persistence?: KeyboardPersistence) => {
    const childKeyboard = configCtx?.childKeyboardInstance
    if (!childKeyboard) return

    const newChildKeyboardConfig = {
      persistence: persistence || childKeyboardConfig?.persistence || KeyboardPersistence.Indefinite,
      size: size || childKeyboardConfig?.size || KeyboardSize.Fill
    }
    childKeyboard.setConfig(newChildKeyboardConfig)
    setChildKeyboardConfig(newChildKeyboardConfig)
  }

  return (
    <div className='flex flex-row justify-start gap-8'>
      {/* key map value type */}
      <div className='flex flex-row justify-center gap-2'>
        <button 
          className='cursor-pointer'
          title='keystroke'
          onClick={() => setMapControlsShow(KeyMapValuetype.Keystroke)} >
          {mapControlsShow === KeyMapValuetype.Keystroke ? <CursorFill /> : <Cursor />}
        </button>
        <button 
          className='cursor-pointer'
          title='child keyboard'
          onClick={() => setMapControlsShow(KeyMapValuetype.Keyboard)} >
            {mapControlsShow === KeyMapValuetype.Keyboard ? <KeyboardFill /> : <Keyboard />}
        </button>
      </div>

      {/* keystroke */}
      <div
        className={[
          'flex-row justify-start gap-2',
          (mapControlsShow === KeyMapValuetype.Keystroke ? 'flex' : 'hidden')
        ].join(' ')} >
        <label className='text-md my-auto' htmlFor='keyStroke'>
          keystroke:
        </label>
        <input 
          ref={keyStrokeInput}
          className='field-sizing-content select-all min-w-8 text-base font-mono dark:bg-zinc-700 bg-zinc-300 rounded-md p-1'
          id='keyStroke'
          value={keyStroke?.toChars().join('') || ''}
          placeholder='*'
          disabled={keyMap === undefined}
          onChange={e => {
            // set keystroke, unset child keyboard
            const keyStroke = KeyStroke.parse(e.target.value)
            setKeyStroke(keyStroke)
            if (keyStroke) {
              setChildKeyboardId(undefined)
            }
          }} />
        <div
          className='flex flex-row flex-wrap gap-1 text-base'>
          {
            // subset of meta chars that are currently supported for keystrokes
            [
              MetaChar.SHIFT, MetaChar.CAPS_LOCK,
              MetaChar.BACKSPACE, 
              MetaChar.UP, MetaChar.RIGHT, MetaChar.DOWN, MetaChar.LEFT,
              MetaChar.SWITCH_KEYBOARD, MetaChar.CLOSE_KEYBOARD
            ].map(metaChar => 
              <MetaCharControl 
                key={metaChar}
                metaChar={metaChar} 
                keystroke={keyStroke} 
                setKeystrokeInput={v => {
                  setKeyStroke(KeyStroke.parse(v))
                  setChildKeyboardId(undefined)
                }} />
            )
          }
        </div>  
      </div>

      {/* child keyboard */}
      <div 
        className={[
          'flex-row justify-start gap-2',
          (mapControlsShow === KeyMapValuetype.Keyboard ? 'flex' : 'hidden')
        ].join(' ')}>
        <label className='text-md my-auto' htmlFor='childKeyboard'>
          child keyboard:
        </label>
        <div>
          <div className='flex flex-row justify-start gap-4 pb-1'>
            {/* child keyboard value */}
            <input
              className='field-sizing-content text-center min-w-8 text-xs font-mono dark:bg-zinc-700 bg-zinc-300 rounded-md p-1'
              id='childKeyboard'
              defaultValue={getKeyboardLineage(childKeyboardId).familyName || childKeyboardId}
              placeholder='*'
              readOnly />
            
            {/* child keyboard size */}
            <div className='flex flex-col justify-start gap-1'>
              <button 
                className={[
                  'cursor-pointer',
                  (childKeyboardConfig?.size === KeyboardSize.Embed ? '' : 'opacity-50'),
                  (childKeyboardId === undefined ? 'hidden' : '')
                ].join(' ')}
                title='embedded child keyboard'
                onClick={() => setChildKeyboardConfigWrapper(KeyboardSize.Embed) } >
                {childKeyboardConfig?.size === KeyboardSize.Embed ? <PipFill /> : <Pip />}
              </button>
              <button 
                className={[
                  'cursor-pointer',
                  (childKeyboardConfig?.size === KeyboardSize.Fill ? '' : 'opacity-50'),
                  (childKeyboardId === undefined ? 'hidden' : '')
                ].join(' ')}
                title='full size child keyboard'
                onClick={() => setChildKeyboardConfigWrapper(KeyboardSize.Fill) } >
                {childKeyboardConfig?.size === KeyboardSize.Fill ? <ArrowsFullscreen /> : <Fullscreen />}
              </button>
            </div>
            {/* child keyboard persistence */}
            <div className='flex flex-col justify-start gap-1'>
              <button 
                className={[
                  'cursor-pointer',
                  (childKeyboardConfig?.persistence === KeyboardPersistence.Brief ? '' : 'opacity-50'),
                  (childKeyboardId === undefined ? 'hidden' : '')
                ].join(' ')}
                title='close child keyboard on any keystroke'
                onClick={() => setChildKeyboardConfigWrapper(undefined, KeyboardPersistence.Brief) } >
                <HourglassBottom />
              </button>
              <button 
                className={[
                  'cursor-pointer',
                  (childKeyboardConfig?.persistence === KeyboardPersistence.Indefinite ? '' : 'opacity-50'),
                  (childKeyboardId === undefined ? 'hidden' : '')
                ].join(' ')}
                title='keep child keyboard open'
                onClick={() => setChildKeyboardConfigWrapper(undefined, KeyboardPersistence.Indefinite) } >
                <Infinity />
              </button>
            </div>
          </div>

          {/* child keyboards list for selection */}
          <div className='relative'>
            <div className='absolute top-0 left-0 right-0'>
              {
                allKeyboardIds.map((kbid) => {
                  // exclude current parent to prevent direct recursion
                  if (kbid === keyboardInstance?.instanceId) return

                  const lineage = getKeyboardLineage(kbid)
                  const canDelete = lineage.instance?.canDelete && lineage.parentInstanceId === keyboardInstance?.instanceId

                  return (
                    <div 
                      key={kbid}
                      className='flex flex-row gap-1 justify-start'>
                      <input 
                        type='radio'
                        name='childKeyboardChoice'
                        id={`childKeyboardChoice-${kbid}`}
                        value={kbid}
                        className='cursor-pointer my-auto'
                        checked={childKeyboardId === kbid}
                        onChange={onChildKeyboardChoice} />

                      <label 
                        htmlFor={`childKeyboardChoice-${kbid}`} 
                        className='my-auto text-base' >
                        {lineage.familyName || kbid}
                      </label>

                      {/* delete child keyboard */}
                      <button 
                        className={[
                          'cursor-pointer my-auto',
                          canDelete ? '' : 'hidden'
                        ].join(' ')} 
                        title='delete child keyboard from session (cannot be undone)'
                        onClick={() => deleteChildKeyboard(kbid) } >
                        <XCircle />
                      </button>
                      <span
                        className={[
                          'my-auto text-sm',
                          canDelete ? '' : 'hidden'
                        ].join(' ')} >
                        <ExclamationCircle />
                      </span>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
        
        {/* launch/render and configure child keyboard */}
        <button 
          className={[
            'cursor-pointer my-auto',
            (childKeyboardId === undefined ? 'hidden' : '')
          ].join(' ')} 
          title='switch to configure child keyboard'
          onClick={() => launchChildKeyboard() } >
          <BoxArrowUpRight />
        </button>
        {/* unset child keyboard */}
        <button 
          className={[
            'cursor-pointer my-auto',
            (childKeyboardId === undefined ? 'hidden' : '')
          ].join(' ')} 
          title='unset child keyboard'
          onClick={() => setChildKeyboardId(undefined) } >
          <XCircle />
        </button>
      </div>
    </div>
  )
}