import { trim } from 'es-toolkit/compat'
import { encode } from 'ufo'

export function getNameUrlEncoded(name: string) {
    const _name = trim(name || '')
    if (!_name) return ''
    return encode(
        _name
            .replace(/[^a-z0-9\s]+/gi, '')
            .replace(/\s+/g, '-')
            .toLowerCase()
    )
}
