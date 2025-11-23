import { RefObject, useEffect, useRef } from "react"
import { cursorChar } from "@lib/keyStroke"
import { EditTextArea } from "@context/textAreaCtx"

export default function TextArea(
  { edit }: {
    edit: RefObject<EditTextArea>
  }
) {
  const textArea = useRef(null as unknown as HTMLTextAreaElement)
  const cursorPos = useRef(0)
  
  // focus to receive keystrokes
  useEffect(
    () => {
      textArea.current.value = cursorChar
      textArea.current.focus()
    },
    []
  )

  // define editor
  useEffect(
    () => {
      edit.current = new EditTextArea(textArea, cursorPos)
    },
    []
  )
  
  return (
    <textarea
      ref={textArea}
      className="field-sizing-content md:field-sizing-fixed md:resize min-w-xs min-h-8 max-h-[50dvh] font-mono"
      placeholder="composer text area"
      readOnly={true} 
      >
    </textarea>
  )
}