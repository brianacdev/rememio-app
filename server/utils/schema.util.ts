import { formatDistanceToNow, getTime } from 'date-fns'

type DateType = Date | string
type MaybeDate = DateType | null | undefined

export function mapRelativeDate(date: DateType) {
    if (!date) throw new Error('Date is required')
    return formatDistanceToNow(date, { addSuffix: true, includeSeconds: false })
}

export function mapDate(date: MaybeDate) {
    if (!date) return null
    return getTime(date)
}
export function mapDateRequired(date: MaybeDate) {
    const time = mapDate(date)
    if (!time) throw new Error('Date is required')
    return time
}

export function mapCreatedAt(data: { createdAt: DateType }) {
    const time = mapDateRequired(data.createdAt)
    return {
        createdAt: time,
        createdAtRelative: mapRelativeDate(data.createdAt),
        createdAtSort: time,
    }
}
