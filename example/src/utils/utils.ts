import { Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')

export const dimensions = {
  width,
  height,
}

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

export const randomString = (): string => {
  let string = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')

  for (let i = 0; i <= 3; i++) {
    string += string
  }

  return string
}
