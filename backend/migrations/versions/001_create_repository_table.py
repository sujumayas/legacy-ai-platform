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

# Valid repository statuses
VALID_STATUSES = ('connecting', 'ready', 'analyzing', 'error')

def upgrade():
    status_type = sa.Enum(*VALID_STATUSES, name='repository_status')
    
    op.create_table(
        'repositories',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('github_url', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('owner', sa.String(), nullable=False),
        sa.Column('default_branch', sa.String(), nullable=False),
        sa.Column('status', status_type, nullable=False, default='connecting'),
        sa.Column('last_analyzed', sa.DateTime(), nullable=True),
        sa.Column('error_message', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP'), onupdate=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.CheckConstraint(
            'status = ANY(ARRAY[{}])'.format(
                ','.join(f"'{status}'" for status in VALID_STATUSES)
            ),
            name='valid_status_check'
        )
    )
    
    # Indexes for common queries
    op.create_index(op.f('ix_repositories_id'), 'repositories', ['id'], unique=False)
    op.create_index(op.f('ix_repositories_github_url'), 'repositories', ['github_url'], unique=True)
    op.create_index(op.f('ix_repositories_owner'), 'repositories', ['owner'], unique=False)
    op.create_index('ix_repositories_user_status', 'repositories', ['user_id', 'status'], unique=False)

def downgrade():
    op.drop_index('ix_repositories_user_status', table_name='repositories')
    op.drop_index(op.f('ix_repositories_owner'), table_name='repositories')
    op.drop_index(op.f('ix_repositories_github_url'), table_name='repositories')
    op.drop_index(op.f('ix_repositories_id'), table_name='repositories')
    op.drop_table('repositories')
    op.execute('DROP TYPE repository_status')
