import { eventHandler } from 'h3'
import { isAuthSessionAuthenticated, anonymousAuthSessionData } from '~~/shared/utils/session.util'
import { getAuthSessionData } from '~~/server/utils/session.util'

export default eventHandler(async (event) => {
    const sessionData = await getAuthSessionData(event)

    if (isAuthSessionAuthenticated(sessionData)) {
        const { secure, ...data } = sessionData
        return data
    }

    return anonymousAuthSessionData
})
