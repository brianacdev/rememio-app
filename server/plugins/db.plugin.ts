import { closeDb } from '~~/server/db'

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('close', async () => {
        await closeDb()
    })
})
