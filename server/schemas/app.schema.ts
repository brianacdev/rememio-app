import { z } from 'zod/v4'
import {
    userDBSchema,
    memorialDBSchema,
    memorialUserDBSchema,
    commentDBSchema,
    photoDBSchema,
    postDBSchema,
    memorialPhotoDBSchema,
} from '../schemas/db.schema'
import { getUserPhotoUrl, getMemorialProfilePhotoUrl, getMemorialCoverPhotoUrl } from '~~/shared/utils/photo.util'
import { getInitials } from '~~/shared/utils/user.util'
import { mapCreatedAt } from '../utils/schema.util'

export const userRoleSchema = z.literal(['owner', 'admin', 'user'])

export const userSchema = userDBSchema
    .pick({
        userId: true,
        firstName: true,
        lastName: true,
        fullName: true,
        photoId: true,
        role: true,
    })
    .transform((data) => ({
        ...data,
        photoUrl: getUserPhotoUrl(data),
        initials: getInitials(data),
    }))

export const userSimpleSchema = userDBSchema
    .pick({
        userId: true,
        firstName: true,
        lastName: true,
        fullName: true,
        photoId: true,
    })
    .transform((data) => ({
        ...data,
        photoUrl: getUserPhotoUrl(data),
        initials: getInitials(data),
    }))

export const memorialSchema = memorialDBSchema
    .omit({
        deletedAt: true,
        deletedBy: true,
    })
    .transform((data) => ({
        ...data,
        profilePhotoUrl: getMemorialProfilePhotoUrl(data),
        coverPhotoUrl: getMemorialCoverPhotoUrl(data),
        datesText: getDatesFormatted(data),
    }))
export const memorialPhotoSchema = memorialPhotoDBSchema
    .omit({
        deletedAt: true,
        deletedBy: true,
    })
    .transform((data) => ({
        ...data,
        ...mapCreatedAt(data),
    }))

export const memorialUserSchema = memorialUserDBSchema.omit({
    bannedAt: true,
    bannedBy: true,
    invitationId: true,
})

export const commentSchema = commentDBSchema.omit({
    deletedAt: true,
    deletedBy: true,
})

const baseCommentSchema = commentDBSchema.omit({
    deletedAt: true,
    deletedBy: true,
    photoId: true,
    postId: true,
})

export const postCommentSchema = z
    .object({
        ...baseCommentSchema.shape,
        postId: z.number(),
    })
    .transform((data) => ({
        ...data,
        ...mapCreatedAt(data),
    }))

export const photoCommentSchema = z
    .object({
        ...baseCommentSchema.shape,
        photoId: z.string(),
    })
    .transform((data) => ({
        ...data,
        ...mapCreatedAt(data),
    }))

export const photoSchema = photoDBSchema.omit({
    deletedAt: true,
    deletedBy: true,
})

export const postSchema = postDBSchema
    .omit({
        deletedAt: true,
        deletedBy: true,
    })
    .transform((data) => ({
        ...data,
        ...mapCreatedAt(data),
    }))
