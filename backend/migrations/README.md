# Database Migrations

## Testing Migrations

To test the migrations in your development environment:

1. Make sure your database is clean:
```bash
dropdb legacy_ai_platform
createdb legacy_ai_platform
```

2. Run the migrations:
```bash
cd backend
alembic upgrade head
```

3. Verify the tables were created:
```bash
psql legacy_ai_platform
# In psql:
\d repositories
\d+ repositories  # For detailed view including indexes
```

4. Test rolling back:
```bash
alembic downgrade base
```

5. Verify tables were removed:
```bash
psql legacy_ai_platform
# In psql:
\d
```

## Common Issues

### Status Enum Type
If you encounter issues with the repository_status enum type when rolling back, you may need to manually drop it:
```sql
DROP TYPE repository_status;
```

### Foreign Key Dependencies
Make sure to run migrations in the correct order. The users table must exist before creating the repositories table due to the foreign key constraint.