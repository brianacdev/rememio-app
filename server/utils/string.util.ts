import { customAlphabet } from 'nanoid'

const DEFAULT_LENGTH = 6

const customNanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', DEFAULT_LENGTH)

export const getRandomString = (length: number = DEFAULT_LENGTH, prefix?: string) => {
    if (prefix) {
        return `${prefix}_${customNanoid(length)}`
    }
    return customNanoid(length)
}
