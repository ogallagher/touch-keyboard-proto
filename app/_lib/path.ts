// TODO load from .env seems not to work for client components
export const websiteBasePath = process.env.BASEPATH || '/touch-keyboard'

export const githubUrl = 'https://github.com/ogallagher/touch-keyboard-proto'
export const siblingServerUrl = {
  BEEPIT: '/beep-it',
  WORDSEARCH: '/wordsearch',
  QUIZCARD: '/quizcard-generator'
}