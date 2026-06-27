CREATE TABLE activity_logs (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT REFERENCES users (id),
    guild_id    BIGINT REFERENCES guilds (id),
    description TEXT NOT NULL,
    data        JSONB,
    logged_at   TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_guild ON activity_logs (guild_id);
CREATE INDEX idx_activity_logs_logged ON activity_logs (logged_at DESC);
