import { KeyGridCtx } from "@context/keyGridCtx"
import { useContext, useEffect, useState } from "react"
import { DashCircle } from "react-bootstrap-icons"

export default function SessionKeyboardListItem(
  { keyboardInstanceId }: {
    keyboardInstanceId: string
  }
) {
  const htmlId = `${SessionKeyboardListItem.name}-${keyboardInstanceId}`
  const keyGridState = useContext(KeyGridCtx)
  const [exportInclude, setExportInclude] = useState(false)

  const keyboardName = keyGridState?.getKeyboard(keyboardInstanceId)?.keyboard.name || '<no-name>'

  // write exportInclude to grid context
  useEffect(
    () => {
      if (!keyGridState) return

      keyGridState.setKeyboardExportConfig(keyboardInstanceId, {
        include: exportInclude
      })
    },
    [ keyGridState, exportInclude, keyboardInstanceId ]
  )

  return (
    <div 
      className='flex flex-row justify-between' 
      title={keyboardName}>
      <div className='flex flex-row gap-1'>
        
        <input 
          className='my-auto'
          type='checkbox' 
          title='include in export/share'
          id={htmlId}
          checked={exportInclude}
          onChange={(e) => {
            setExportInclude(e.target.checked)
          }} />
        
        <div className='flex flex-col justify-center'>
          <label htmlFor={htmlId}>
            {keyboardName}
          </label>
        </div>
      </div>
      
      <button
        className='cursor-pointer'
        title='remove from session'
        onClick={() => {
          keyGridState?.deleteKeyGrid(keyboardInstanceId)
        }} >
        <DashCircle />
      </button>
    </div>
  )
}