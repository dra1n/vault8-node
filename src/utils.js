export const required = (name, value) => {
  if (!value) {
    throw new Error(`${name} is required`)
  }

  return value
}

export const seconds = date => (
  Math.floor(date / 1000)
)

export const reverse = str => (
  str.split('').reverse().join('')
)

export const isEmpty = value => (
  value === null || value.length === 0
)

export const flatten = arrays => (
  [].concat.apply([], arrays)
)

export const compact = arr => (
  arr.filter(v => v)
)
