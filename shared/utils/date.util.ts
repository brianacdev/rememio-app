import { formatDistance } from 'date-fns'

export function formatRelativeDate(date: string | null) {
    if (!date) return ''
    return formatDistance(new Date(date), new Date(), { addSuffix: true })
}
