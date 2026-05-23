"""initial orders tables

Revision ID: 001
Revises:
Create Date: 2026-05-19

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "orders",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("order_number", sa.String(32), nullable=False),
        sa.Column("customer_name", sa.String(255), nullable=False),
        sa.Column("phone", sa.String(20), nullable=False),
        sa.Column("subtotal_sar", sa.Numeric(10, 2), nullable=False),
        sa.Column("total_sar", sa.Numeric(10, 2), nullable=False),
        sa.Column("status", sa.String(32), nullable=False),
        sa.Column("upsell_accepted", sa.Boolean(), default=False),
        sa.Column("upsell_product_slug", sa.String(64), nullable=True),
        sa.Column("purchase_sent", sa.Boolean(), default=False),
        sa.Column("source_url", sa.Text(), nullable=True),
        sa.Column("utm_source", sa.String(128), nullable=True),
        sa.Column("utm_medium", sa.String(128), nullable=True),
        sa.Column("utm_campaign", sa.String(128), nullable=True),
        sa.Column("utm_content", sa.String(128), nullable=True),
        sa.Column("utm_term", sa.String(128), nullable=True),
        sa.Column("fbp", sa.String(255), nullable=True),
        sa.Column("fbc", sa.String(255), nullable=True),
        sa.Column("lead_event_id", sa.String(64), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
    )
    op.create_index("ix_orders_order_number", "orders", ["order_number"], unique=True)
    op.create_index("ix_orders_phone", "orders", ["phone"])

    op.create_table(
        "order_items",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("order_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("orders.id", ondelete="CASCADE")),
        sa.Column("product_slug", sa.String(64), nullable=False),
        sa.Column("product_name_ar", sa.String(255), nullable=False),
        sa.Column("offer_code", sa.String(32), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column("line_total_sar", sa.Numeric(10, 2), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("order_items")
    op.drop_index("ix_orders_phone", table_name="orders")
    op.drop_index("ix_orders_order_number", table_name="orders")
    op.drop_table("orders")
