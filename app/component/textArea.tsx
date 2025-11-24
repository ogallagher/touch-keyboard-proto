import { RefObject, useEffect, useRef } from "react"
import { EditTextArea } from "@context/textAreaCtx"

export default function TextArea(
  { edit: editRef, visible }: {
    edit: RefObject<EditTextArea>
    visible: boolean
  }
) {
  const textArea = useRef(null as unknown as HTMLTextAreaElement)
  const cursorPos = useRef(0)

  // define editor
  useEffect(
    () => {
      editRef.current = new EditTextArea(textArea, cursorPos)
    },
    []
  )
  
  // focus to receive keystrokes
  useEffect(
    () => {
      if (visible) {
        textArea.current.focus()
      }
    },
    [visible]
  )
  
  return (
    <textarea
      ref={textArea}
      className="field-sizing-content md:field-sizing-fixed md:resize min-w-xs min-h-32 md:min-h-8 max-h-50 font-mono"
      placeholder="composer text area"
      readOnly={true} 
      >
    </textarea>
  )
}