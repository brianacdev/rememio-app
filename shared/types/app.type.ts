import { z } from 'zod/v4'
import {
    memorialSchema,
    memorialUserSchema,
    userSchema,
    userSimpleSchema,
    postCommentSchema,
    photoCommentSchema,
} from '~~/server/schemas/app.schema'
import { mapper } from '~~/server/utils/mapper.util'

export type User = z.infer<typeof userSchema>
export type UserSimple = z.infer<typeof userSimpleSchema>
export type Memorial = z.infer<typeof memorialSchema>
export type MemorialUserContext = ReturnType<typeof mapper.mapMemorialUserContext>
export type MemorialUser = ReturnType<typeof mapper.mapMemorialUsers>[number]

export type MemorialPhoto = ReturnType<typeof mapper.mapMemorialPhoto>
export type UserMemorial = ReturnType<typeof mapper.mapUserMemorials>[number]
export type PostListItem = ReturnType<typeof mapper.mapMemorialPostList>[number]

export type PostComment = PostListItem['comments'][number]
export type PhotoComment = MemorialPhoto['comments'][number]
