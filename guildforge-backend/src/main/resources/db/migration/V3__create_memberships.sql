CREATE TABLE memberships (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT REFERENCES users (id),
    guild_id    BIGINT REFERENCES guilds (id),
    rank        VARCHAR(100) DEFAULT 'Newcomer',
    joined_at   TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, guild_id)
);

CREATE INDEX idx_memberships_user ON memberships (user_id);
CREATE INDEX idx_memberships_guild ON memberships (guild_id);
