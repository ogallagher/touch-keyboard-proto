import MetaCharControl from "@component/metaChar"
import { KeyGridCtx } from "@context/keyGridCtx"
import { listenerName } from "@lib/eventSync"
import { switchKeyboardName } from "@lib/keyboardDefinitions/meta/switchKeyboard"
import KeyMap, { KeyMapValuetype } from "@lib/keyMap"
import KeyStroke, { MetaChar } from "@lib/keyStroke"
import { ChangeEvent, Dispatch, RefObject, SetStateAction, useContext, useEffect, useState } from "react"
import { BoxArrowUpRight, Keyboard, KeyboardFill, XCircle } from "react-bootstrap-icons"

export default function ConfigKeyMap(
  { keyMap, keyStroke, setKeyStroke, keyStrokeInput, childKeyboardId, setChildKeyboardId }: {
    keyMap: RefObject<KeyMap|undefined>
    keyStroke: KeyStroke|undefined
    setKeyStroke: Dispatch<SetStateAction<KeyStroke|undefined>>
    keyStrokeInput: RefObject<HTMLInputElement>
    childKeyboardId: string|undefined
    setChildKeyboardId: Dispatch<SetStateAction<string|undefined>>
  }
) {
  const gridCtx = useContext(KeyGridCtx)
  const [mapControlsShow, setMapControlsShow] = useState(KeyMapValuetype.Keystroke)
  const [allKeyboardIds, setAllKeyboardIds] = useState([] as string[])

  // listen to session keyboards list
  useEffect(
    () => {
      if (!gridCtx) return

      const name = listenerName(ConfigKeyMap.name)
      gridCtx.keyboardsListListeners.set(name, () => setAllKeyboardIds(
        gridCtx.keyboardIds.filter(kbId => kbId !== switchKeyboardName)
        .concat(gridCtx.childKeyboardIds)
      ))

      return () => { gridCtx.keyboardsListListeners.delete(name) }
    },
    [ gridCtx ]
  )

  const onChildKeyboardChoice = (e: ChangeEvent<HTMLInputElement>) => {
    // set child keyboard, unset keystroke
    const childKeyboardId = e.target.value
    setChildKeyboardId(childKeyboardId)
    if (childKeyboardId) {
      setKeyStroke(undefined)
    }
  }

  const getKeyboardFamilyName = (kbid?: string) => {
    const keyboardInstance = kbid !== undefined ? gridCtx?.getKeyboard(kbid) : undefined
    if (!keyboardInstance) return

    if (keyboardInstance.parentInstanceId) {
      const parentInstance = gridCtx?.getKeyboard(keyboardInstance.parentInstanceId)
      if (parentInstance) {
        return `${parentInstance.keyboard.name}.${keyboardInstance.keyboard.name}`
      }
      else {
        console.error(`failed to get parent keyboard instance id=${keyboardInstance.parentInstanceId}`)
      }
    }
    
    return keyboardInstance.keyboard.name
  }

  const launchChildKeyboard = () => {
    const childKeyboard = gridCtx?.getKeyboard(childKeyboardId!)
    if (!gridCtx || !childKeyboard) return

    gridCtx.addKeyGrid(childKeyboard, true)
  }

  return (
    <div className='flex flex-row justify-start gap-8'>
      {/* key map value type */}
      <div className='flex flex-row justify-center gap-2'>
        <button 
          className='cursor-pointer'
          title='keystroke'
          onClick={() => setMapControlsShow(KeyMapValuetype.Keystroke)} >
            {mapControlsShow === KeyMapValuetype.Keystroke ? 'KEYS' : 'keys'}
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
          placeholder='none'
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
              MetaChar.SWITCH_KEYBOARD
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
          {/* child keyboard value */}
          <input
            className='field-sizing-content text-center min-w-8 text-xs font-mono dark:bg-zinc-700 bg-zinc-300 rounded-md p-1'
            id='childKeyboard'
            defaultValue={getKeyboardFamilyName(childKeyboardId) || childKeyboardId}
            placeholder='*'
            readOnly />

          {/* child keyboards list for selection */}
          <div className='relative'>
            <div className='absolute top-0 left-0 right-0'>
              {
                allKeyboardIds.map((kbid) => (
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
                      {getKeyboardFamilyName(kbid) || kbid}
                    </label>
                  </div>
                ))
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