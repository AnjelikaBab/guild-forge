CREATE TABLE ranks (
    id          BIGSERIAL PRIMARY KEY,
    guild_id    BIGINT REFERENCES guilds (id),
    name        VARCHAR(100) NOT NULL,
    threshold   INTEGER NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ranks_guild_threshold ON ranks (guild_id, threshold);
