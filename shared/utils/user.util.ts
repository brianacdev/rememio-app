import { trim } from 'es-toolkit/compat'

export function getFullName(names: { firstName: string; lastName: string }) {
    if (names?.firstName && names?.lastName) {
        return `${names?.firstName} ${names?.lastName}`
    }
    if (!names?.firstName) {
        return names?.lastName
    }
    if (!names?.lastName) {
        return names?.firstName
    }
    return ''
}

export function getInitials(names: { firstName: string | null; lastName: string | null }) {
    const firstName = names.firstName?.trim() || ''
    const lastName = names.lastName?.trim() || ''
    if (firstName.length >= 1 && lastName.length >= 1) {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    }
    if (firstName.length >= 1) {
        return firstName.charAt(0).toUpperCase()
    }
    if (lastName.length >= 1) {
        return lastName.charAt(0).toUpperCase()
    }
    return ''
}

export function getFirstName(name: string) {
    const trimmed = trim(name)
    if (!trimmed) return ''
    const parts = trimmed.split(/\s+/)
    return parts[0] || ''
}
