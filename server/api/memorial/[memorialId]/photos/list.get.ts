import { memorialCRUD, memorialUserCRUD } from '~~/server/crud'
import { mapper } from '~~/server/utils/mapper.util'

export default defineEventHandler(async (event) => {
    const { memorialId } = await requireViewMemorial(event)

    const [memorialPhotosData, memorialUsersData] = await Promise.all([
        memorialCRUD.query.getMemorialPhotos(memorialId),
        memorialUserCRUD.query.getMemorialUsers(memorialId),
    ])

    return {
        photos: mapper.mapMemorialPhotoList(memorialPhotosData),
        memorialUsers: mapper.mapMemorialUsers(memorialUsersData),
    }
})
