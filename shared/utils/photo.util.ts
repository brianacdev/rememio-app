const photoBaseUrl = '/_photo'

export function getUserPhotoUrl(userData: { userId: string; photoId: string | null | undefined } | null | undefined) {
    if (userData?.userId && userData?.photoId) {
        return `${photoBaseUrl}/user/${userData.userId}?pid=${userData.photoId || Date.now()}`
    }
    return undefined
}

export function getMemorialPhotoUrl(memorialId: string, photoId: string) {
    if (memorialId && photoId) {
        return `${photoBaseUrl}/mem/${memorialId}/photo/${photoId}`
    }
    return undefined
}

export function getMemorialCoverPhotoUrl(memorialData: { memorialId: string; coverPhotoId: string | null }) {
    if (memorialData?.memorialId && memorialData?.coverPhotoId) {
        return `${photoBaseUrl}/mem/${memorialData.memorialId}/cover?pid=${memorialData.coverPhotoId || Date.now()}`
    }
    return undefined
}

export function getMemorialProfilePhotoUrl(memorialData: { memorialId: string; profilePhotoId: string | null }) {
    if (memorialData?.memorialId && memorialData?.profilePhotoId) {
        return `${photoBaseUrl}/mem/${memorialData.memorialId}/profile?pid=${memorialData.profilePhotoId || Date.now()}`
    }
    return undefined
}

export function getPhotoUrl(photoId: string) {
    if (photoId) {
        return `${photoBaseUrl}/photo/${photoId}`
    }
    return undefined
}
