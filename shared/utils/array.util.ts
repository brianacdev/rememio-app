export function firstOrNullScalar<T extends object>(items: T[]): T[keyof T] | null {
    const firstObj = firstOrNull(items)
    if (!firstObj) return null
    const firstKey = Object.keys(firstObj)[0]
    return firstKey ? firstObj[firstKey as keyof T] : null
}

export async function firstOrNullScalarAsync<T extends object>(items: Promise<T[]>): Promise<T[keyof T] | null> {
    return firstOrNullScalar(await items)
}

export function scalars<T extends object>(items: T[]): T[keyof T][] {
    const firstObj = firstOrNull(items)
    if (!firstObj) return []
    const firstKey = Object.keys(firstObj)[0]
    return firstKey ? items.map((item) => item[firstKey as keyof T]) : []
}

export async function scalarsAsync<T extends object>(items: Promise<T[]>): Promise<T[keyof T][]> {
    return scalars(await items)
}

export function firstScalar<T extends object>(items: T[]): T[keyof T] {
    const firstObj = first(items)
    const firstKey = Object.keys(firstObj)[0]
    if (firstKey) return firstObj[firstKey as keyof T]
    throw new Error('Expected at least one item with at least one value, but got zero with values')
}

export async function firstScalarAsync<T extends object>(items: Promise<T[]>): Promise<T[keyof T]> {
    return firstScalar(await items)
}

export function oneOrNullScalar<T extends object>(items: T[]): T[keyof T] | null {
    const firstObj = oneOrNull(items)
    if (firstObj) {
        const firstKey = Object.keys(firstObj)[0]
        if (firstKey) return firstObj[firstKey as keyof T]
    }
    return null
}

export async function oneOrNullScalarAsync<T extends object>(items: Promise<T[]>): Promise<T[keyof T] | null> {
    return oneOrNullScalar(await items)
}

export function oneScalar<T extends object>(items: T[]): T[keyof T] {
    const firstObj = one(items)
    const firstKey = Object.keys(firstObj)[0]
    if (firstKey) return firstObj[firstKey as keyof T]
    throw new Error('Expected one item with at least one value, but got zero with values')
}

export async function oneScalarAsync<T extends object>(items: Promise<T[]>): Promise<T[keyof T]> {
    return oneScalar(await items)
}

export function firstOrNull<T>(items: T[]): T | null {
    if (!items || items.length === 0) return null
    return items[0] || null
}

export async function firstOrNullAsync<T>(items: Promise<T[]>): Promise<T | null> {
    return firstOrNull(await items)
}

export function first<T>(items: T[]): T {
    const result = firstOrNull(items)
    if (!result) throw new Error('Expected at least one item, but got zero')
    return result
}

export async function firstAsync<T>(items: Promise<T[]>): Promise<T> {
    return first(await items)
}

export function oneOrNull<T>(items: T[]): T | null {
    if (!items || items.length === 0) return null
    if (items.length > 1) throw new Error(`Expected one or zero items, but got ${items.length}`)
    return firstOrNull(items)
}

export async function oneOrNullAsync<T>(items: Promise<T[]>): Promise<T | null> {
    return oneOrNull(await items)
}

export function one<T>(items: T[]): T {
    if (!items) throw new Error('Expected one item, but got zero')
    if (items.length !== 1) throw new Error(`Expected one, but got ${items.length}`)
    const item = items[0]
    if (!item) throw new Error('Expected one item, but got zero')
    return item
}

export async function oneAsync<T>(items: Promise<T[]>): Promise<T> {
    return one(await items)
}
