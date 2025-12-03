import KeyLabel, { Zone, ZoneKey } from "@lib/keyLabel"
import { Direction } from "@lib/orientation"
import { InitGestureSegmentType } from "@lib/touchGesture"
import { Dispatch, SetStateAction } from "react"

export default function KeyZoneLabel(
  { zone, label, isShift, isCapsLock, gestureSegment, setKeyLabel }: {
    zone: Zone,
    label: KeyLabel|undefined
    isShift: boolean
    isCapsLock: boolean
    gestureSegment: {segment?: InitGestureSegmentType, direction?: Direction}|undefined
    setKeyLabel?: Dispatch<SetStateAction<KeyLabel | undefined>>
  }
) {
  const pseudoCond = label?.getPseudo(isShift, isCapsLock, gestureSegment?.segment)
  const zoneLabel = label?.getZone(zone, pseudoCond, gestureSegment?.direction)

  const filterValue = (v: string) => (v.trim() === '') ? undefined : v

  return (
    <div className='flex flex-row justify-center overflow-x-clip'>
      <input 
        className={[
          'flex flex-col justify-center font-mono text-center',
          setKeyLabel ? 'select-all field-sizing-content' : 'pointer-none cursor-default',
          (zoneLabel === undefined && setKeyLabel) ? 'min-w-4' : ''
        ].join(' ')}
        name={KeyZoneLabel.name}
        placeholder={setKeyLabel ? '*' : undefined}
        value={zoneLabel || ''}
        onChange={setKeyLabel && label && ( (e) => {
          const newLabel = label.clone()
          newLabel.set(
            new ZoneKey(zone, pseudoCond, gestureSegment?.direction), 
            filterValue(e.target.value)
          )

          setKeyLabel(newLabel)
        } )}
        readOnly={setKeyLabel ? undefined : true} />
    </div>
  )
}