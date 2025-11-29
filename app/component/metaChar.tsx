import KeyStroke, { MetaChar } from "@lib/keyStroke"
import { Alt, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Backspace, Capslock, ChevronBarDown, ChevronUp, Command, Escape, Keyboard, Shift, Windows } from "react-bootstrap-icons"

function MetaCharIcon(
  { c }: {
    c: MetaChar
  }
) {
  switch (c) {
    case MetaChar.SHIFT:
      return <Shift />
    case MetaChar.CAPS_LOCK:
      return <Capslock />

    case MetaChar.FN:
      return 'fn'
    case MetaChar.CTRL:
      return <ChevronUp />
    case MetaChar.ALT:
      return <Alt />
    case MetaChar.CMD:
      return <Command />
    case MetaChar.ESC:
      return <Escape />
    case MetaChar.WIN:
      return <Windows />

    case MetaChar.BACKSPACE:
      return <Backspace />

    case MetaChar.UP:
      return <ArrowUp />
    case MetaChar.RIGHT:
      return <ArrowRight />
    case MetaChar.DOWN:
      return <ArrowDown />
    case MetaChar.LEFT:
      return <ArrowLeft />

    case MetaChar.CLOSE_KEYBOARD:
      return <ChevronBarDown />
    case MetaChar.SWITCH_KEYBOARD:
      return <Keyboard />
  }
}

export default function MetaCharControl(
  { metaChar, keystroke, setKeystrokeInput }: {
    metaChar: MetaChar,
    keystroke: KeyStroke|undefined
    setKeystrokeInput: (v: string) => void
  }
) {
  return (
    <button
      title={metaChar}
      className='cursor-pointer dark:bg-zinc-700 bg-zinc-300 rounded-sm px-1'
      onClick={() => {
        setKeystrokeInput(
          (keystroke?.toChars().join('') || '')
          + metaChar
        )
      }} >
      <MetaCharIcon c={metaChar} />
    </button>
  )
}