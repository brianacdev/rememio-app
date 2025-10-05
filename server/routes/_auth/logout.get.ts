import { clearAuthSession } from '~~/server/utils/session.util'

export default eventHandler(async (event) => {
    await clearAuthSession(event)
    return sendRedirect(event, '/')
})
