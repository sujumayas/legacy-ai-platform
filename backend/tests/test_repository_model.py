import pytest
from datetime import datetime
from app.models.repository import Repository, RepositoryStatus
from app.models.user import User
from sqlalchemy.exc import IntegrityError

def test_create_repository(db_session):
    # Create a test user first
    user = User(
        github_id=12345,
        username="testuser",
        email="test@example.com",
        access_token="test_token"
    )
    db_session.add(user)
    db_session.commit()

    # Create a repository
    repo = Repository(
        github_url="https://github.com/testuser/testrepo",
        name="testrepo",
        owner="testuser",
        default_branch="main",
        status=RepositoryStatus.CONNECTING,
        user_id=user.id
    )
    
    db_session.add(repo)
    db_session.commit()

    # Verify the repository was created
    assert repo.id is not None
    assert repo.status == RepositoryStatus.CONNECTING
    assert repo.created_at is not None
    assert repo.updated_at is not None

def test_unique_github_url_constraint(db_session):
    # Create a test user
    user = User(
        github_id=12345,
        username="testuser",
        email="test@example.com",
        access_token="test_token"
    )
    db_session.add(user)
    db_session.commit()

    # Create first repository
    repo1 = Repository(
        github_url="https://github.com/testuser/testrepo",
        name="testrepo",
        owner="testuser",
        default_branch="main",
        status=RepositoryStatus.CONNECTING,
        user_id=user.id
    )
    db_session.add(repo1)
    db_session.commit()

    # Try to create another repository with the same URL
    repo2 = Repository(
        github_url="https://github.com/testuser/testrepo",
        name="testrepo2",
        owner="testuser",
        default_branch="main",
        status=RepositoryStatus.CONNECTING,
        user_id=user.id
    )
    
    with pytest.raises(IntegrityError):
        db_session.add(repo2)
        db_session.commit()

def test_repository_status_enum(db_session):
    # Create a test user
    user = User(
        github_id=12345,
        username="testuser",
        email="test@example.com",
        access_token="test_token"
    )
    db_session.add(user)
    db_session.commit()

    # Test all valid statuses
    for status in RepositoryStatus:
        repo = Repository(
            github_url=f"https://github.com/testuser/testrepo-{status.value}",
            name=f"testrepo-{status.value}",
            owner="testuser",
            default_branch="main",
            status=status,
            user_id=user.id
        )
        db_session.add(repo)
        db_session.commit()
        
        assert repo.status == status

def test_cascade_delete(db_session):
    # Create a test user
    user = User(
        github_id=12345,
        username="testuser",
        email="test@example.com",
        access_token="test_token"
    )
    db_session.add(user)
    db_session.commit()

    # Create a repository
    repo = Repository(
        github_url="https://github.com/testuser/testrepo",
        name="testrepo",
        owner="testuser",
        default_branch="main",
        status=RepositoryStatus.CONNECTING,
        user_id=user.id
    )
    db_session.add(repo)
    db_session.commit()

    # Delete the user
    db_session.delete(user)
    db_session.commit()

    # Verify the repository was also deleted
    assert db_session.query(Repository).filter_by(id=repo.id).first() is None

def test_repository_helper_methods(db_session):
    # Create a test user
    user = User(
        github_id=12345,
        username="testuser",
        email="test@example.com",
        access_token="test_token"
    )
    db_session.add(user)
    db_session.commit()

    # Create repositories with different statuses
    repo1 = Repository(
        github_url="https://github.com/testuser/testrepo1",
        name="testrepo1",
        owner="testuser",
        default_branch="main",
        status=RepositoryStatus.READY,
        user_id=user.id
    )
    repo2 = Repository(
        github_url="https://github.com/testuser/testrepo2",
        name="testrepo2",
        owner="testuser",
        default_branch="main",
        status=RepositoryStatus.ANALYZING,
        user_id=user.id
    )
    
    db_session.add_all([repo1, repo2])
    db_session.commit()

    # Test get_by_url
    found_repo = Repository.get_by_url(db_session, repo1.github_url)
    assert found_repo.id == repo1.id

    # Test get_by_user with no status filter
    user_repos = Repository.get_by_user(db_session, user.id)
    assert len(user_repos) == 2

    # Test get_by_user with status filter
    ready_repos = Repository.get_by_user(db_session, user.id, RepositoryStatus.READY)
    assert len(ready_repos) == 1
    assert ready_repos[0].id == repo1.id
