export const mergeClasses = (...classes: Array<any | undefined>): string => classes
  .filter(c => typeof c === 'string' && c.length > 0).join(' ')
