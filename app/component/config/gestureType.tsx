import Image from "next/image"
import { websiteBasePath } from "@lib/path"
import { AbstractTouchGesture, gestureTypeToPhrase, InitGestureSegmentType, TouchGestureType } from "@lib/touchGesture"
import { Direction, directionToHeading, isCardinal, radianToDegree } from "@lib/orientation"

const imageSpacerChar = 'm'

export default function GestureTypeLabel(
  { gesture }: {
    gesture: AbstractTouchGesture|undefined
  }
) {
  const direction = gesture?.direction || Direction.RIGHT
  let flipCorner = false
  if (gesture?.direction && gesture?.cornerDirection) {
    if (
      // cardinal corner swipes
      (gesture.direction === Direction.UP && gesture.cornerDirection === Direction.LEFT)
      || (gesture.direction === Direction.RIGHT && gesture.cornerDirection === Direction.UP)
      || (gesture.direction === Direction.DOWN && gesture.cornerDirection === Direction.RIGHT)
      || (gesture.direction === Direction.LEFT && gesture.cornerDirection === Direction.DOWN)
      // diagonal corner swipes
      || (gesture.direction === Direction.UPRIGHT && gesture.cornerDirection === Direction.LEFT)
      || (gesture.direction === Direction.DOWNRIGHT && gesture.cornerDirection === Direction.UP)
      || (gesture.direction === Direction.DOWNLEFT && gesture.cornerDirection === Direction.RIGHT)
      || (gesture.direction === Direction.UPLEFT && gesture.cornerDirection === Direction.DOWN)
    ) {
      flipCorner = true
    }
  }

  return (
    <div 
      className='relative'
      style={{
        transform: [
          `rotate(${radianToDegree(directionToHeading( direction, isCardinal(direction) ? Math.PI/2 : Math.PI/4 ))}deg)`,
          `scaleX(${flipCorner ? -1 : 1})`,
          (gesture?.initType === InitGestureSegmentType.DIAGONAL_SWIPE && flipCorner ? `rotate(-90deg)` : '')
        ].join(' '),
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