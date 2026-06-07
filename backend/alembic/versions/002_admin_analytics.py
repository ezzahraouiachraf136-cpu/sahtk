"""admin analytics events table

Revision ID: 002
Revises: 001
Create Date: 2026-05-23

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "analytics_events",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("event_name", sa.String(64), nullable=False),
        sa.Column("page_url", sa.Text(), nullable=True),
        sa.Column("product_slug", sa.String(64), nullable=True),
        sa.Column("session_id", sa.String(64), nullable=True),
        sa.Column("utm_source", sa.String(128), nullable=True),
        sa.Column("utm_medium", sa.String(128), nullable=True),
        sa.Column("utm_campaign", sa.String(128), nullable=True),
        sa.Column("value", sa.Numeric(10, 2), nullable=True),
        sa.Column("order_id", sa.String(64), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
    )
    op.create_index(
        "ix_analytics_events_event_name", "analytics_events", ["event_name"]
    )
    op.create_index(
        "ix_analytics_events_session_id", "analytics_events", ["session_id"]
    )
    op.create_index(
        "ix_analytics_events_created_at", "analytics_events", ["created_at"]
    )


def downgrade() -> None:
    op.drop_index("ix_analytics_events_created_at", table_name="analytics_events")
    op.drop_index("ix_analytics_events_session_id", table_name="analytics_events")
    op.drop_index("ix_analytics_events_event_name", table_name="analytics_events")
    op.drop_table("analytics_events")
