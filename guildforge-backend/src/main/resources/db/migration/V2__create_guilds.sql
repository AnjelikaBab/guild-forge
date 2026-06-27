CREATE TABLE guilds (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    theme       VARCHAR(50) NOT NULL,
    description TEXT,
    dsl_rules   TEXT,
    owner_id    BIGINT REFERENCES users (id),
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_guilds_owner ON guilds (owner_id);
