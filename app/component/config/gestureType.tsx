import Image from "next/image"
import { websiteBasePath } from "@lib/path"
import { AbstractTouchGesture, gestureTypeToPhrase } from "@lib/touchGesture"
import { Direction, directionToHeading, isCardinal, radianToDegree } from "@lib/orientation"

const imageSpacerChar = 'm'

export default function GestureTypeLabel(
  { gesture }: {
    gesture: AbstractTouchGesture|undefined
  }
) {
  const direction = gesture?.direction || Direction.RIGHT

  return (
    <div 
      className='relative'
      style={{
        transform: `rotate(${
          radianToDegree(directionToHeading(
            direction, 
            isCardinal(direction) ? Math.PI/2 : Math.PI/4
          ))
        }deg)`
      }}>
      {/* Letter as parent container dimensions placeholder for next Image.fill adapt to font size. */}
      {gesture?.type && imageSpacerChar}
      {gesture?.type && (
        <Image 
          src={`${websiteBasePath}/gestureType/${gesture.type}.svg`}
          alt={gesture?.type !== undefined ? gestureTypeToPhrase(gesture.type) : ''}
          title={`${gesture?.direction || ''} ${gestureTypeToPhrase(gesture.type)} ${gesture?.cornerDirection || ''}`}
          loading='lazy'
          fill={true} />
      )}
    </div>
  )
}