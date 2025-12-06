import IncDec from "@component/incDec"
import { ConfigCtx } from "@context/configCtx"
import { listenerName } from "@lib/eventSync"
import { KeyGridCtx } from "@context/keyGridCtx"
import { Orientation } from "@lib/orientation"
import { useContext, useEffect, useRef, useState } from "react"
import { BoxArrowInUp, BoxArrowUp, FileEarmarkArrowDown, Grid3x3, ListUl, PlusCircle, Share } from "react-bootstrap-icons"
import SessionKeyboardListItem from "./sessionKeyboardListItem"
import KeyboardDefinition, { KeyboardInstance, KeyboardPersistence, KeyboardSize } from "@lib/keyboardDefinition"
import { KeyDefinition } from "@lib/keyDefinition"
import KeyLabel from "@lib/keyLabel"
import KeyMap from "@lib/keyMap"
import { exportShareUrlKeyboardsQueryKey, keyboardFilePartDelim, keyboardFileSuffix, keyboardsFileSuffix } from "@lib/path"
import { compressString } from "@lib/data"
import { ConfigSection } from "@lib/control"
import { switchKeyboardName } from "@lib/keyboardDefinitions/meta/switchKeyboard"
import { dvhToPx, fontSizeToPx, pxToDvh, pxToFontSize } from "@lib/unit"

type OnExport = (exportType: 'file'|'url') => void

export default function ConfigKeyGrid(
  { configSection }: {
    configSection: ConfigSection
  }
) {
  const keyGridState = useContext(KeyGridCtx)
  const configCtx = useContext(ConfigCtx)
  const [keyboardInstanceIds, setKeyboardInstanceIds] = useState([] as string[])
  const [gridDimensions, setGridDimensions] = useState(configCtx?.keyboardInstance?.keyboard.dimensions)
  const [keyboardName, setKeyboardName] = useState(configCtx?.keyboardInstance?.keyboard.name)
  const addKeyboard = useRef(null as unknown as () => void)
  const [showKeyboardsList, setShowKeyboardsList] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const importFileInput = useRef(null as unknown as HTMLInputElement)
  const onImportFileInput = useRef(null as unknown as () => void)
  /**
   * Either the download file link or the share (keyboards in query params) link.
   */
  const [ exportUrl, setExportUrl ] = useState(undefined as URL|undefined)
  const [ exportFilename, setExportFilename ] = useState(undefined as string|undefined)
  const onExport = useRef(null as unknown as OnExport)
  /**
   * Key grid viewport height, in font size (~em).
   */
  const [keyGridViewportHeight, setKeyGridViewportHeight] = useState(undefined as number|undefined)

  // listen to session keyboards list
  useEffect(
    () => {
      if (!keyGridState) return

      const name = listenerName(ConfigKeyGrid.name)
      keyGridState.keyboardsListListeners.set(name, () => setKeyboardInstanceIds(
        keyGridState.keyboardIds.filter(kbId => kbId !== switchKeyboardName)
      ))

      return () => { keyGridState.keyboardsListListeners.delete(name) }
    },
    [ keyGridState ]
  )

  // init on new config context
  useEffect(
    () => {
      if (!configCtx) return

      const name = listenerName(ConfigKeyGrid.name)
      configCtx.addLoadListener(name, () => {
        setGridDimensions(configCtx.keyboardInstance?.keyboard.dimensions)
        setKeyboardName(configCtx.keyboardInstance?.keyboard.name)

        const dvh = !configCtx.gridViewportHeight ? undefined : pxToDvh(fontSizeToPx(configCtx.gridViewportHeight))
        setKeyGridViewportHeight(dvh)
      })

      return () => configCtx.deleteLoadListener(name)
    },
    [ configCtx ]
  )

  // write name to config context
  useEffect(
    () => {
      if (!configCtx || !keyboardName || !configCtx.keyboardInstance) return

      if (configCtx.keyboardInstance.keyboard.name !== keyboardName) {
        configCtx.setKeyboardName(keyboardName)
      }
    },
    [ configCtx, keyboardName ]
  )
  // write dimensions to config context
  useEffect(
    () => {
      if (!configCtx) return

      if (configCtx.keyboardInstance && gridDimensions) {
        configCtx.setGridDimensions(gridDimensions)
      }
    },
    [ configCtx, gridDimensions ]
  )
  // write viewport height to config context
  useEffect(
    () => {
      if (!configCtx) return

      const em = !keyGridViewportHeight ? undefined : pxToFontSize(dvhToPx(keyGridViewportHeight))
      configCtx.setGridViewportHeight(em)
    },
    [ configCtx, keyGridViewportHeight ]
  )

  // define addKeyboard
  useEffect(
    () => {
      if (!keyGridState) return

      const randomDigits = (len: number) => {
        const digits = new Array(len)
        for (let i=0; i<len; i++) {
          digits[i] = Math.round(Math.random() * 9)
        }
        return digits.join('')
      }
      addKeyboard.current = () => {
        keyGridState.addKeyGrid(
          new KeyboardInstance(
            new KeyboardDefinition(
              `new-keyb-${randomDigits(3)}`,
              [[ new KeyDefinition({
                label: new KeyLabel(),
                map: new KeyMap()
              }) ]]
            ),
            { 
              // TODO not sure why this is count is inaccurate
              index: keyboardInstanceIds.length,
              persistence: KeyboardPersistence.Indefinite,
              size: KeyboardSize.Fill
            }
          ),
          true
        )
      }
    },
    [ keyGridState, keyboardInstanceIds ]
  )

  // define onImportFileInput
  useEffect(
    () => {
      if (!keyGridState) return
    
      onImportFileInput.current = () => {
        const files = importFileInput.current.files
        if (!files) return

        const p = []

        for (let f=0; f<files.length; f++) {
          const file = files.item(f)!
          console.log(`import keyboards from file name=${file.name}`)
          const reader = new FileReader()

          p.push(new Promise((res) => {
            reader.onerror = (e) => {
              console.error(`failed to read keyboards from file name=${file.name}. ${e}`)
              res(false)
            }
            reader.onload = () => {
              const loadOpts = {
                persistence: KeyboardPersistence.Indefinite,
                size: KeyboardSize.Fill
              }
              const s = reader.result as string
              let keyboardInstances: KeyboardInstance[] = []

              if (s.trimStart().startsWith('[')) {
                keyboardInstances = keyboardInstances.concat(KeyboardInstance.loadMany(s, loadOpts))
              }
              else {
                keyboardInstances.push(KeyboardInstance.load(s, loadOpts))
              }

              for (const keyboardInstance of keyboardInstances) {
                console.log(`loaded keyboard name=${keyboardInstance.keyboard.name}`)
                keyGridState.addKeyGrid(keyboardInstance, true)
              }
              
              res(true)
            }
          }))

          reader.readAsText(file)
        }

        Promise.all(p).then(() => {
          // show keyboards on finish
          setShowKeyboardsList(true)
        })
      }
    },
    [ keyGridState ]
  )

  // define onExport
  useEffect(
    () => {
      if (!keyGridState) return

      onExport.current = (exportType) => {
        const keyboards = (
          // determine list of exported keyboard ids
          keyboardInstanceIds
          .filter(kid => keyGridState.getKeyboardExportConfig(kid)?.include ? kid : undefined)
          // convert to keyboard instances
          .map(kid => keyGridState.getKeyboard(kid)!)
        )

        // skip export if no keyboards included
        if (keyboards.length === 0) {
          console.warn('no keyboards included for export')
          return
        }

        // serialize as str
        const keyboardsStr = keyboards.length > 1 ? JSON.stringify(keyboards) : JSON.stringify(keyboards[0])
        console.info(`serialized count=${keyboards.length} keyboard instances for export`)
        
        // convert str to url
        new Promise((res: (url?: URL) => void) => {
          switch (exportType) {
            case 'file':
              const reader = new FileReader()
              reader.onerror = (e) => {
                console.error(`failed to create file data url from keyboards str. ${e}`)
              }
              reader.onload = () => {
                // set recommended download file name
                 setExportFilename(
                  [
                    (keyboards.length > 1 ? `touch-keyboard-proto.x${keyboards.length}` : keyboards[0].keyboard.name),
                    (keyboards.length > 1 ? keyboardsFileSuffix : keyboardFileSuffix),
                    'json'
                  ].join(keyboardFilePartDelim)
                )
                res(new URL(reader.result as string))
              }
              reader.readAsDataURL(new Blob([keyboardsStr], { type: 'application/json' }))
              break

            case 'url':
              const url = new URL(window.location.href)
              url.search = ''
              url.searchParams.set(
                exportShareUrlKeyboardsQueryKey, 
                compressString(keyboardsStr)
              )
              setExportFilename(undefined)
              res(url)
              break

            default:
              console.error(`invalid export type=${exportType}`)
              res()
          }
        })
        .then((url) => {
          setExportUrl(undefined)

          setTimeout(
            () => setExportUrl(url),
            800
          )
        })
      }
    },
    [ keyGridState, keyboardInstanceIds ]
  )
  
  return (
    <div
      className={[
        'flex-col justify-evenly gap-1 pb-4',
        (configSection === 'grid' ? 'flex' : 'hidden')
      ].join(' ')} >
      {/* session keyboards */}
      <div className='flex flex-row flex-wrap justify-between gap-2 text-lg'>
        <div className='text-base'>session keyboards:</div>

        {/* toggle show list */}
        <button
          className='cursor-pointer'
          title='Toggle display list'
          onClick={() => setShowKeyboardsList(!showKeyboardsList)} >
          <ListUl />
        </button>

        {/* import from file */}
        <input
          ref={importFileInput}
          className='hidden'
          type='file'
          accept='application/json,.json' multiple={true}
          onChange={() => onImportFileInput.current()} />
        <button
          className='cursor-pointer'
          title='Import keyboards from file'
          onClick={() => importFileInput.current.click()} >
          <BoxArrowInUp />
        </button>

        {/* toggle show export */}
        <button
          className='cursor-pointer'
          title='Export keyboards'
          onClick={() => {
            const _showExport = !showExport
            setShowExport(_showExport)
            // also open keyboards list to clarify what is included
            if (_showExport) {
              setShowKeyboardsList(true)
            }
          }} >
          <BoxArrowUp />
        </button>
      </div>

      {/* session keyboards list */}
      <div 
        title='Session keyboards list'
        className={[
          showKeyboardsList ? '' : 'hidden',
          'border-b-2 border-t-2 my-1'
        ].join(' ')} >
        {keyboardInstanceIds.map(keyboardInstanceId => (
          <SessionKeyboardListItem 
            key={keyboardInstanceId}
            keyboardInstanceId={keyboardInstanceId}
            keyboardName={configCtx?.keyboardInstance?.instanceId === keyboardInstanceId ? keyboardName : undefined} />
        ))}
        {/* add keyboard */}
        <div className='flex flex-row justify-center pb-1'>
          <button
            className='cursor-pointer'
            title='Add new empty keyboard'
            onClick={() => addKeyboard.current()} >
            <PlusCircle />
          </button>
        </div>
      </div>

      {/* keyboards export */}
      <div 
        className={[
          'flex-row justify-between gap-1 border-b-2 pb-2',
          (showExport ? 'flex' : 'hidden')
        ].join(' ')}
        title='Export options' >
        {/* download file */}
        <button
          className='cursor-pointer'
          title='Download file'
          onClick={() => onExport.current('file')} >
          <FileEarmarkArrowDown />
        </button>

        <a 
          className={[
            'text-xs hover:underline text-blue-600',
            (exportUrl !== undefined ? '' : 'hidden')
          ].join(' ')}
          href={exportUrl?.toString()}
          download={exportFilename} >
          {exportFilename || 'keyboards export url'}
        </a>

        {/* share url */}
        <button
          className='cursor-pointer'
          title='Share link'
          onClick={() => onExport.current('url')} >
          <Share />
        </button>
      </div>

      {/* grid size */}
      <div
        className='flex flex-row justify-center gap-8'>
        {/* grid dimensions */}
        <div 
          className='flex flex-row justify-center gap-2 text-2xl'
          title='Keyboard grid dimensions' >
          <div className='flex flex-col justify-center pr-2'>
            <Grid3x3 className='text-4xl' />
          </div>

          {/* config grid dimensions.width */}
          <IncDec
            orientation={Orientation.Horizontal} 
            title='Adjust col count'
            onDec={() => setGridDimensions(gridDimensions?.colAdd(-1))}
            onInc={() => setGridDimensions(gridDimensions?.colAdd(+1))} />
          {/* config grid dimensions.height */}
          <IncDec 
            orientation={Orientation.Vertical}
            title='Adjust row count'
            onDec={() => setGridDimensions(gridDimensions?.rowAdd(-1))}
            onInc={() => setGridDimensions(gridDimensions?.rowAdd(+1))} />
        </div>

        {/* grid viewport height */}
        <div className='flex flex-ro gap-2'>
          <label
            className='my-auto'
            htmlFor='configGridViewportHeight'>
            Viewport height:
          </label>
          <input 
            id='configGridViewportHeight'
            type='range'
            className='h-full'
            // unit is dynamic view height percentage (dvh)
            min={10} max={70} step={5}
            value={keyGridViewportHeight || 0}
            onChange={(e) => {
              setKeyGridViewportHeight(Number.parseInt(e.target.value))
            }} />
        </div>
      </div>
      

      {/* name */}
      <div
        className='flex flex-row justify-center gap-2 px-2' >
        <label className='flex flex-col justify-center' htmlFor='keyboardName'>
          name: 
        </label>
        <input
          className='field-sizing-content min-w-8 text-base font-mono dark:bg-zinc-700 bg-zinc-300 rounded-md p-1'
          type='text'
          id='keyboardName'
          placeholder='keyboard name'
          value={keyboardName || ''} 
          onChange={e => setKeyboardName(e.target.value)} />
      </div>
    </div>
  )
}