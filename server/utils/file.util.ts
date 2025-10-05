import mime from 'mime/lite'
import type { H3Event } from 'h3'
import fsp from 'fs/promises'
import { resolve } from 'pathe'

import env from '~~/server/env'
import type { ImageOrientation } from './img.util'

export function getFileExtension(file: { type?: string; name?: string }) {
    if (!file) {
        return ''
    }
    const contentType = file.type ?? ''
    const fileExtension = getFileExtensionFromContentType(contentType)
    if (fileExtension) {
        return fileExtension
    }

    const fileName = file.name ?? ''
    return getFileExtensionFromFileName(fileName)
}

export function getFileExtensionFromFileName(fileName: string) {
    return (fileName && mime.getType(fileName)) || 'application/octet-stream'
}

export function getFileExtensionFromContentType(contentType: string) {
    if (!contentType) {
        return ''
    }
    return mime.getExtension(contentType) ?? ''
}

export type UploadedFileLike = {
    photoId: string
    name: string
    type: string
    size: number
    width: number | null
    height: number | null
    orientation: ImageOrientation
    bytes: () => Promise<Buffer>
}

export const localDirectory = resolve(process.cwd(), 'local', env.BUCKET_NAME)

async function ensureLocalDirectory() {
    await fsp.mkdir(localDirectory, { recursive: true })
    return localDirectory
}

export async function storeFileLocal(file: UploadedFileLike, filename: string) {
    const directory = await ensureLocalDirectory()
    const storeFilename = `${file.photoId}__${filename}`
    const fullPath = `${directory}/${storeFilename}`
    const buffer = await file.bytes()
    await fsp.writeFile(fullPath, buffer)
    return storeFilename
}

// export async function storeFileCloud(
// 	file: UploadedFileLike,
// 	filename: string,
// 	userId: string,
// 	options?: {
// 		photoId?: string
// 		width?: number | null
// 		height?: number | null
// 		memorialId?: string
// 		memorialPhotoType?: string
// 	},
// 	customMetadata?: Record<string, string>
// ) {
// 	// const bucket = getBucket()
// 	// const fileContent = await file.bytes()
// 	// const storageFile = bucket.file(pathname)
// 	// const metadata = {
// 	//     ...(customMetadata ?? {}),
// 	//     userId,
// 	//     fileName: file.name,
// 	//     fileExtension,
// 	//     photoId,
// 	//     memorialId: options?.memorialId ?? '',
// 	//     width: options?.width?.toString() ?? '',
// 	//     height: options?.height?.toString() ?? '',
// 	//     memorialPhotoType: options?.memorialPhotoType ?? '',
// 	//     contentType: file.type,
// 	//     size: file.size,
// 	// }
// 	// await storageFile.save(fileContent, {
// 	//     metadata,
// 	// })
// 	// await photoCRUD.mutate.createPhoto(
// 	//     {
// 	//         id: photoId,
// 	//         userId: userId,
// 	//         storageKey: pathname,
// 	//         storageLocation: storageFile.bucket.name,
// 	//         filename: file.name,
// 	//         fileType: file.type,
// 	//         metadata: metadata,
// 	//     },
// 	//     options?.memorialId || undefined
// 	// )
// 	// return photoId
// }

// let _storage: Storage | null = null

// export function getStorage() {
// 	if (!_storage) {
// 		const config = useRuntimeConfig()
// 		if (config.googleCloud.credentials) {
// 			_storage = new Storage({
// 				keyFilename: config.googleCloud.credentials,
// 			})
// 		} else {
// 			_storage = new Storage()
// 		}
// 	}
// 	return _storage
// }

// let _bucket: Bucket | null = null

// export function getBucket() {
// 	if (!_bucket) {
// 		const config = useRuntimeConfig()
// 		_bucket = getStorage().bucket(env.BUCKET_NAME)
// 	}
// 	return _bucket
// }

// export async function serveFileFromCloud(event: H3Event, pathname: string) {
// 	const bucket = getBucket()
// 	const storageFile = bucket.file(pathname)

// 	if (!(await storageFile.exists())) {
// 		throw createError({ message: 'File not found', statusCode: 404 })
// 	}

// 	const [metadata] = await storageFile.getMetadata()

// 	setHeader(event, 'Content-Type', metadata.contentType || mime.getType(pathname) || 'application/octet-stream')

// 	setHeader(event, 'etag', metadata.etag)

// 	if (metadata.size) {
// 		setHeader(event, 'Content-Length', Number(metadata.size))
// 	}

// 	return storageFile.createReadStream()
// }

export async function serveFileFromLocal(event: H3Event, pathname: string, contentType: string | null) {
    const directory = await ensureLocalDirectory()
    if (!contentType) {
        setHeader(event, 'Content-Type', mime.getType(pathname) || 'application/octet-stream')
    } else {
        setHeader(event, 'Content-Type', contentType)
    }
    return fsp.readFile(`${directory}/${pathname}`)
}
