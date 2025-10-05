import { sql, relations } from 'drizzle-orm'
import {
    integer,
    pgTable,
    varchar,
    boolean,
    timestamp,
    text,
    jsonb,
    serial,
    primaryKey,
    check,
    foreignKey,
    pgEnum,
} from 'drizzle-orm/pg-core'

export const userRole = pgEnum('user_role', ['admin', 'user'])

export const users = pgTable('users', {
    userId: varchar().primaryKey(),
    email: varchar().notNull().unique(),
    photoId: varchar(),
    firstName: varchar().notNull(),
    lastName: varchar().notNull(),
    fullName: varchar()
        .notNull()
        .generatedAlwaysAs(sql`first_name || ' ' || last_name`),
    role: userRole().notNull().default('user'),
    bannedAt: timestamp({ withTimezone: true, mode: 'string' }),
    bannedReason: text(),
    bannedBy: varchar(),
    isBanned: boolean()
        .notNull()
        .generatedAlwaysAs(sql`banned_at IS NOT NULL OR banned_by IS NOT NULL`),
    createdAt: timestamp({ withTimezone: true, mode: 'string' }).notNull().defaultNow(),
})

export const photos = pgTable('photos', {
    photoId: varchar().primaryKey(),
    storageLocation: varchar().notNull(),
    storageKey: varchar().notNull(),
    filename: varchar().notNull(),
    width: integer(),
    height: integer(),
    orientation: varchar(),
    contentType: varchar(),
    size: integer(),
    metadata: jsonb().notNull().default('{}'),
    deletedAt: timestamp({ withTimezone: true, mode: 'string' }),
    deletedBy: varchar().references(() => users.userId),
    isDeleted: boolean()
        .notNull()
        .generatedAlwaysAs(sql`deleted_at IS NOT NULL OR deleted_by IS NOT NULL`),
    createdBy: varchar()
        .notNull()
        .references(() => users.userId),
    createdAt: timestamp({ withTimezone: true, mode: 'string' }).notNull().defaultNow(),
})

export const userRelations = relations(users, ({ one }) => ({
    userPhoto: one(photos, {
        fields: [users.photoId],
        references: [photos.photoId],
    }),
    userBannedBy: one(users, {
        fields: [users.bannedBy],
        references: [users.userId],
    }),
}))

export const partners = pgTable('partners', {
    partnerId: varchar().primaryKey(),
    name: varchar().notNull(),
    deletedAt: timestamp({ withTimezone: true, mode: 'string' }),
    deletedBy: varchar().references(() => users.userId),
    isDeleted: boolean()
        .notNull()
        .generatedAlwaysAs(sql`deleted_at IS NOT NULL OR deleted_by IS NOT NULL`),
    createdBy: varchar()
        .notNull()
        .references(() => users.userId),
    createdAt: timestamp({ withTimezone: true, mode: 'string' }).notNull().defaultNow(),
})

export const partnerUserRole = pgEnum('partner_user_role', ['admin', 'user'])

export const partnerUsers = pgTable(
    'partner_users',
    {
        partnerId: varchar()
            .notNull()
            .references(() => partners.partnerId),
        userId: varchar()
            .notNull()
            .references(() => users.userId),
        role: partnerUserRole().notNull().default('user'),
        removedAt: timestamp({ withTimezone: true, mode: 'string' }),
        removedBy: varchar().references(() => users.userId),
        isRemoved: boolean()
            .notNull()
            .generatedAlwaysAs(sql`removed_at IS NOT NULL OR removed_by IS NOT NULL`),
        createdBy: varchar()
            .notNull()
            .references(() => users.userId),
        createdAt: timestamp({ withTimezone: true, mode: 'string' }).notNull().defaultNow(),
    },
    (t) => [primaryKey({ name: 'pk_partner_users', columns: [t.partnerId, t.userId] })]
)

export const memorials = pgTable('memorials', {
    memorialId: varchar().primaryKey(),
    name: varchar().notNull(),
    nameSlug: varchar().notNull(),
    profilePhotoId: varchar().references(() => photos.photoId),
    coverPhotoId: varchar().references(() => photos.photoId),
    partnerId: varchar().references(() => partners.partnerId),
    birthDateStr: varchar(),
    deathDateStr: varchar(),
    obituary: text(),
    isObituaryPublic: boolean().notNull().default(false),
    deletedAt: timestamp({ withTimezone: true, mode: 'string' }),
    deletedBy: varchar().references(() => users.userId),
    isDeleted: boolean()
        .notNull()
        .generatedAlwaysAs(sql`deleted_at IS NOT NULL OR deleted_by IS NOT NULL`),
    owner: varchar().references(() => users.userId),
    createdBy: varchar()
        .notNull()
        .references(() => users.userId),
    createdAt: timestamp({ withTimezone: true, mode: 'string' }).notNull().defaultNow(),
})

export const memorialInvitations = pgTable('memorial_invitations', {
    invitationId: varchar().primaryKey(),
    memorialId: varchar()
        .notNull()
        .references(() => memorials.memorialId),
    expiresAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
    createdBy: varchar()
        .notNull()
        .references(() => users.userId),
    createdAt: timestamp({ withTimezone: true, mode: 'string' }).notNull().defaultNow(),
})

export const memorialUserRole = pgEnum('memorial_user_role', ['admin', 'user'])

export const memorialUsers = pgTable(
    'memorial_users',
    {
        memorialId: varchar()
            .notNull()
            .references(() => memorials.memorialId),
        userId: varchar()
            .notNull()
            .references(() => users.userId),
        role: memorialUserRole().notNull().default('user'),
        invitationId: varchar(),
        relation: varchar().notNull().default(''),
        bannedAt: timestamp({ withTimezone: true, mode: 'string' }),
        bannedBy: varchar().references(() => users.userId),
        isBanned: boolean()
            .notNull()
            .generatedAlwaysAs(sql`banned_at IS NOT NULL OR banned_by IS NOT NULL`),
        createdAt: timestamp({ withTimezone: true, mode: 'string' }).notNull().defaultNow(),
    },
    (t) => [
        primaryKey({ name: 'pk_memorial_users', columns: [t.memorialId, t.userId] }),
        foreignKey({
            columns: [t.invitationId],
            foreignColumns: [memorialInvitations.invitationId],
            name: 'fk_memorial_users_invitation',
        }),
    ]
)

export const posts = pgTable('posts', {
    postId: serial().primaryKey(),
    memorialId: varchar()
        .notNull()
        .references(() => memorials.memorialId),
    content: text().notNull().default(''),
    deletedAt: timestamp({ withTimezone: true, mode: 'string' }),
    deletedBy: varchar().references(() => users.userId),
    isDeleted: boolean()
        .notNull()
        .generatedAlwaysAs(sql`deleted_at IS NOT NULL OR deleted_by IS NOT NULL`),
    createdBy: varchar()
        .notNull()
        .references(() => users.userId),
    createdAt: timestamp({ withTimezone: true, mode: 'string' }).notNull().defaultNow(),
})

export const memorialPhotos = pgTable(
    'memorial_photos',
    {
        memorialId: varchar()
            .notNull()
            .references(() => memorials.memorialId),
        photoId: varchar()
            .notNull()
            .references(() => photos.photoId),
        postId: integer().references(() => posts.postId),
        caption: text(),
        deletedAt: timestamp({ withTimezone: true, mode: 'string' }),
        deletedBy: varchar().references(() => users.userId),
        isDeleted: boolean()
            .notNull()
            .generatedAlwaysAs(sql`deleted_at IS NOT NULL OR deleted_by IS NOT NULL`),
        createdBy: varchar()
            .notNull()
            .references(() => users.userId),
        createdAt: timestamp({ withTimezone: true, mode: 'string' }).notNull().defaultNow(),
    },
    (t) => [primaryKey({ name: 'pk_memorial_photos', columns: [t.memorialId, t.photoId] })]
)

export const comments = pgTable(
    'comments',
    {
        commentId: serial().primaryKey(),
        memorialId: varchar()
            .notNull()
            .references(() => memorials.memorialId),
        postId: integer().references(() => posts.postId),
        photoId: varchar().references(() => photos.photoId),
        content: text().notNull(),
        deletedAt: timestamp({ withTimezone: true, mode: 'string' }),
        deletedBy: varchar().references(() => users.userId),
        isDeleted: boolean()
            .notNull()
            .generatedAlwaysAs(sql`deleted_at IS NOT NULL OR deleted_by IS NOT NULL`),
        createdBy: varchar()
            .notNull()
            .references(() => users.userId),
        createdAt: timestamp({ withTimezone: true, mode: 'string' }).notNull().defaultNow(),
    },
    (t) => [
        check(
            'comment_post_or_photo_check',
            sql`( ${t.postId} IS NOT NULL AND ${t.photoId} IS NULL ) OR ( ${t.postId} IS NULL AND ${t.photoId} IS NOT NULL )`
        ),
    ]
)

export const reactions = pgTable(
    'reactions',
    {
        reactionId: serial().primaryKey(),
        memorialId: varchar()
            .notNull()
            .references(() => memorials.memorialId),
        postId: integer().references(() => posts.postId),
        photoId: varchar().references(() => photos.photoId),
        userId: varchar()
            .notNull()
            .references(() => users.userId),
        createdAt: timestamp({ withTimezone: true, mode: 'string' }).notNull().defaultNow(),
    },
    (t) => [
        check(
            'reaction_post_or_photo_check',
            sql`( ${t.postId} IS NOT NULL AND ${t.photoId} IS NULL ) OR ( ${t.postId} IS NULL AND ${t.photoId} IS NOT NULL )`
        ),
    ]
)
