"""create repository table

Revision ID: 001
Revises: 
Create Date: 2024-02-03

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic
revision = '001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'repositories',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('github_url', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('owner', sa.String(), nullable=False),
        sa.Column('default_branch', sa.String(), nullable=False),
        sa.Column('status', sa.String(), nullable=False),
        sa.Column('last_analyzed', sa.DateTime(), nullable=True),
        sa.Column('error_message', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_repositories_github_url'), 'repositories', ['github_url'], unique=True)
    op.create_index(op.f('ix_repositories_id'), 'repositories', ['id'], unique=False)

def downgrade():
    op.drop_index(op.f('ix_repositories_id'), table_name='repositories')
    op.drop_index(op.f('ix_repositories_github_url'), table_name='repositories')
    op.drop_table('repositories')
