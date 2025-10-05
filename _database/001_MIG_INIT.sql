-- DATABASE SCHEMA postgres tables (aligned with server/db/schema.ts)

-- Enums
CREATE TYPE user_role AS ENUM ('admin', 'user');
CREATE TYPE partner_user_role AS ENUM ('admin', 'user');
CREATE TYPE memorial_user_role AS ENUM ('admin', 'user');

-- Users
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    photo_id VARCHAR,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    full_name VARCHAR GENERATED ALWAYS AS (
        first_name || ' ' || last_name
    ) STORED NOT NULL,
    role user_role NOT NULL DEFAULT 'user',
    banned_at TIMESTAMPTZ,
    banned_reason TEXT,
    banned_by VARCHAR,
    is_banned BOOLEAN NOT NULL GENERATED ALWAYS AS (
        banned_at IS NOT NULL OR banned_by IS NOT NULL
    ) STORED,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Photos
CREATE TABLE IF NOT EXISTS photos (
    photo_id VARCHAR PRIMARY KEY,
    storage_location VARCHAR NOT NULL,
    storage_key VARCHAR NOT NULL,
    filename VARCHAR NOT NULL,
    width INTEGER,
    height INTEGER,
    orientation VARCHAR,
    content_type VARCHAR,
    size INTEGER,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    deleted_at TIMESTAMPTZ,
    deleted_by VARCHAR REFERENCES users(user_id),
    is_deleted BOOLEAN NOT NULL GENERATED ALWAYS AS (
        deleted_at IS NOT NULL OR deleted_by IS NOT NULL
    ) STORED,
    created_by VARCHAR NOT NULL REFERENCES users(user_id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Partners
CREATE TABLE IF NOT EXISTS partners (
    partner_id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    deleted_at TIMESTAMPTZ,
    deleted_by VARCHAR REFERENCES users(user_id),
    is_deleted BOOLEAN NOT NULL GENERATED ALWAYS AS (
        deleted_at IS NOT NULL OR deleted_by IS NOT NULL
    ) STORED,
    created_by VARCHAR NOT NULL REFERENCES users(user_id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Partner Users
CREATE TABLE IF NOT EXISTS partner_users (
    partner_id VARCHAR NOT NULL REFERENCES partners(partner_id),
    user_id VARCHAR NOT NULL REFERENCES users(user_id),
    role partner_user_role NOT NULL DEFAULT 'user',
    removed_at TIMESTAMPTZ,
    removed_by VARCHAR REFERENCES users(user_id),
    is_removed BOOLEAN NOT NULL GENERATED ALWAYS AS (
        removed_at IS NOT NULL OR removed_by IS NOT NULL
    ) STORED,
    created_by VARCHAR NOT NULL REFERENCES users(user_id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_partner_users PRIMARY KEY (partner_id, user_id)
);

-- Memorials
CREATE TABLE IF NOT EXISTS memorials (
    memorial_id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    name_slug VARCHAR NOT NULL,
    profile_photo_id VARCHAR REFERENCES photos(photo_id),
    cover_photo_id VARCHAR REFERENCES photos(photo_id),
    partner_id VARCHAR REFERENCES partners(partner_id),
    birth_date_str VARCHAR,
    death_date_str VARCHAR,
    obituary TEXT,
    is_obituary_public BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    deleted_by VARCHAR REFERENCES users(user_id),
    is_deleted BOOLEAN NOT NULL GENERATED ALWAYS AS (
        deleted_at IS NOT NULL OR deleted_by IS NOT NULL
    ) STORED,
    owner VARCHAR REFERENCES users(user_id),
    created_by VARCHAR NOT NULL REFERENCES users(user_id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Memorial Invitations
CREATE TABLE IF NOT EXISTS memorial_invitations (
    invitation_id VARCHAR PRIMARY KEY,
    memorial_id VARCHAR NOT NULL REFERENCES memorials(memorial_id),
    expires_at TIMESTAMPTZ NOT NULL,
    created_by VARCHAR NOT NULL REFERENCES users(user_id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Memorial Users
CREATE TABLE IF NOT EXISTS memorial_users (
    memorial_id VARCHAR NOT NULL REFERENCES memorials(memorial_id),
    user_id VARCHAR NOT NULL REFERENCES users(user_id),
    role memorial_user_role NOT NULL DEFAULT 'user',
    invitation_id VARCHAR REFERENCES memorial_invitations(invitation_id),
    relation VARCHAR NOT NULL DEFAULT '',
    banned_at TIMESTAMPTZ,
    banned_by VARCHAR REFERENCES users(user_id),
    is_banned BOOLEAN NOT NULL GENERATED ALWAYS AS (
        banned_at IS NOT NULL OR banned_by IS NOT NULL
    ) STORED,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_memorial_users PRIMARY KEY (memorial_id, user_id)
);

-- Posts
CREATE TABLE IF NOT EXISTS posts (
    post_id SERIAL PRIMARY KEY,
    memorial_id VARCHAR NOT NULL REFERENCES memorials(memorial_id),
    content TEXT NOT NULL DEFAULT '',
    deleted_at TIMESTAMPTZ,
    deleted_by VARCHAR REFERENCES users(user_id),
    is_deleted BOOLEAN NOT NULL GENERATED ALWAYS AS (
        deleted_at IS NOT NULL OR deleted_by IS NOT NULL
    ) STORED,
    created_by VARCHAR NOT NULL REFERENCES users(user_id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Memorial Photos
CREATE TABLE IF NOT EXISTS memorial_photos (
    memorial_id VARCHAR NOT NULL REFERENCES memorials(memorial_id),
    photo_id VARCHAR NOT NULL REFERENCES photos(photo_id),
    post_id INTEGER REFERENCES posts(post_id),
    caption TEXT,
    deleted_at TIMESTAMPTZ,
    deleted_by VARCHAR REFERENCES users(user_id),
    is_deleted BOOLEAN NOT NULL GENERATED ALWAYS AS (
        deleted_at IS NOT NULL OR deleted_by IS NOT NULL
    ) STORED,
    created_by VARCHAR NOT NULL REFERENCES users(user_id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_memorial_photos PRIMARY KEY (memorial_id, photo_id)
);

-- Comments
CREATE TABLE IF NOT EXISTS comments (
    comment_id SERIAL PRIMARY KEY,
    memorial_id VARCHAR NOT NULL REFERENCES memorials(memorial_id),
    post_id INTEGER REFERENCES posts(post_id),
    photo_id VARCHAR REFERENCES photos(photo_id),
    content TEXT NOT NULL,
    deleted_at TIMESTAMPTZ,
    deleted_by VARCHAR REFERENCES users(user_id),
    is_deleted BOOLEAN NOT NULL GENERATED ALWAYS AS (
        deleted_at IS NOT NULL OR deleted_by IS NOT NULL
    ) STORED,
    created_by VARCHAR NOT NULL REFERENCES users(user_id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT comment_post_or_photo_check CHECK (
        (post_id IS NOT NULL AND photo_id IS NULL) OR
        (post_id IS NULL AND photo_id IS NOT NULL)
    )
);

-- Reactions
CREATE TABLE IF NOT EXISTS reactions (
    reaction_id SERIAL PRIMARY KEY,
    memorial_id VARCHAR NOT NULL REFERENCES memorials(memorial_id),
    post_id INTEGER REFERENCES posts(post_id),
    photo_id VARCHAR REFERENCES photos(photo_id),
    user_id VARCHAR NOT NULL REFERENCES users(user_id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT reaction_post_or_photo_check CHECK (
        (post_id IS NOT NULL AND photo_id IS NULL) OR
        (post_id IS NULL AND photo_id IS NOT NULL)
    )
);


