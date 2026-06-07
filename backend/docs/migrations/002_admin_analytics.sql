-- Admin dashboard: analytics events table
-- Run in PostgreSQL if Alembic auto-migrate is not used

CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY,
    event_name VARCHAR(64) NOT NULL,
    page_url TEXT,
    product_slug VARCHAR(64),
    session_id VARCHAR(64),
    utm_source VARCHAR(128),
    utm_medium VARCHAR(128),
    utm_campaign VARCHAR(128),
    value NUMERIC(10, 2),
    order_id VARCHAR(64),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc')
);

CREATE INDEX IF NOT EXISTS ix_analytics_events_event_name ON analytics_events (event_name);
CREATE INDEX IF NOT EXISTS ix_analytics_events_session_id ON analytics_events (session_id);
CREATE INDEX IF NOT EXISTS ix_analytics_events_created_at ON analytics_events (created_at);
