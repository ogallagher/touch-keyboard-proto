import { KeyGridCtx } from "@context/keyGridCtx"
import { useContext, useState } from "react"
import { DashCircle } from "react-bootstrap-icons"

export default function SessionKeyboardListItem(
  { keyboardInstanceId }: {
    keyboardInstanceId: string
  }
) {
  const keyGridState = useContext(KeyGridCtx)
  const [checked, setChecked] = useState(false)

  const keyboardName = keyGridState?.getKeyboard(keyboardInstanceId)?.keyboard.name || '<no-name>'

  return (
    <div 
      className='flex flex-row justify-between' 
      title={keyboardName}>
      <div className='flex flex-row gap-1'>
        <input 
          type='checkbox' 
          title='include in export/share'
          name={keyboardInstanceId}
          checked={checked}
          onChange={(e) => {
            setChecked(e.target.checked)
          }} />
        
        <div className='flex flex-col justify-center'>
          <label htmlFor={keyboardInstanceId}>
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