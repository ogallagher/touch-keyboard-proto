import { Github } from 'react-bootstrap-icons'
import { githubUrl, siblingServerUrl } from '@lib/path'

export default function Header() {
  return (
    <header
      className='border-b-2 dark:border-b-white border-b-black px-4 py-2'>
      <nav
        className='flex flex-row my-auto justify-between'>
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
          className='flex flex-row flex-wrap font-mono font-bold gap-2'>
          <span className='hover:text-lg'>
            <a href={siblingServerUrl.BEEPIT}>
              beep-it
            </a>
          </span>

          <span className='hover:text-lg'>
            <a href={siblingServerUrl.WORDSEARCH}>
              wordsearch
            </a>
          </span>

          <span className='hover:text-lg'>
            <a href={siblingServerUrl.QUIZCARD}>
              quizcard
            </a>
          </span>
        </div>
      </nav>
    </header>
  )
}