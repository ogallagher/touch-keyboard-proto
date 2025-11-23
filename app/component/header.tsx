import { CaretDown, CaretUp, Github, List } from 'react-bootstrap-icons'
import { githubUrl, siblingServerUrl } from '@lib/path'
import { useState } from 'react'

export default function Header() {
  const [showLinks, setShowLinks] = useState(false)
  const [showNav, setShowNav] = useState(true)

  return (
    <header
      className='border-b-2 dark:border-b-white border-b-black px-4'>
      <nav
        className={[
          'md:flex flex-row my-auto justify-between py-2',
          showNav ? 'flex' : 'hidden'
        ].join(' ')}>
        {/* home = github */}
        <div
          className='flex flex-col justify-center hover:text-lg'>
            <a href={githubUrl}>
              <Github />
            </a>
        </div>

        {/* current page */}
        <div
          className='flex flex-col justify-center font-mono font-bold text-lg'>
          <span>touch-keyboard-proto</span>
        </div>

        {/* sibling pages */}
        <div
          className={[
            'font-mono font-bold gap-2',
            'flex md:flex-row md:flex-wrap',
            'flex-col justify-center'
          ].join(' ')}>
          <button
            className='cursor-pointer md:hidden flex flex-row justify-end'
            onClick={() => setShowLinks(!showLinks)}>
            <List />
          </button>

          <span 
            className={[
              'hover:underline md:block flex flex-row justify-end',
              showLinks ? '' : 'hidden'
            ].join(' ')} >
            <a href={siblingServerUrl.BEEPIT}>
              beep-it
            </a>
          </span>

          <span 
            className={[
              'hover:underline md:block flex flex-row justify-end',
              showLinks ? '' : 'hidden'
            ].join(' ')} >
            <a href={siblingServerUrl.WORDSEARCH}>
              wordsearch
            </a>
          </span>

          <span 
            className={[
              'hover:underline md:block flex flex-row justify-end',
              showLinks ? '' : 'hidden'
            ].join(' ')} >
            <a href={siblingServerUrl.QUIZCARD}>
              quizcard
            </a>
          </span>

          <button
            className={[
              'cursor-pointer md:hidden flex flex-row justify-end',
              showLinks ? '' : 'hidden'
            ].join(' ')}
            onClick={() => setShowNav(false)}>
            <CaretUp />
          </button>
        </div>
      </nav>

      <button
        className={[
          'cursor-pointer md:hidden',
          showNav ? 'hidden' : 'absolute right-0 top-0 px-4 py-2'
        ].join(' ')}
        onClick={() => setShowNav(true)}>
        <CaretDown />
      </button>
    </header>
  )
}