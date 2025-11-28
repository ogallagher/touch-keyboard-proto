export function listenerName(className: string) {
  return `${className}${new Date().toISOString()}`
}
