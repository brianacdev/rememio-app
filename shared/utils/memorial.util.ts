import { format } from 'date-fns'

export function getDatesFormatted(dates: { birthDateStr: string | null; deathDateStr: string | null }) {
    if (!dates?.birthDateStr && !dates?.deathDateStr) return ''
    const formattedBirthDate = dates?.birthDateStr ? format(dates.birthDateStr, 'MMM d yyyy') : ''
    const formattedDeathDate = dates?.deathDateStr ? format(dates.deathDateStr, 'MMM d yyyy') : ''

    if (formattedBirthDate && formattedDeathDate) {
        return `${formattedBirthDate} - ${formattedDeathDate}`
    }
    if (formattedBirthDate) {
        return `Born ${formattedBirthDate}`
    }
    if (formattedDeathDate) {
        return `Died ${formattedDeathDate}`
    }

    return ''
}
