from github import Github
from typing import Optional, Dict, Any
import os

class GitHubService:
    def __init__(self, access_token: str):
        self.github = Github(access_token)

    def get_repository_info(self, repo_url: str) -> Optional[Dict[str, Any]]:
        """
        Get repository information from GitHub
        repo_url format: 'owner/repo' or full GitHub URL
        """
        try:
            # Extract owner/repo from URL if full URL is provided
            if "github.com" in repo_url:
                repo_url = repo_url.split("github.com/")[1]
            repo_url = repo_url.rstrip("/")
            
            repo = self.github.get_repo(repo_url)
            return {
                "name": repo.name,
                "owner": repo.owner.login,
                "default_branch": repo.default_branch,
                "github_url": repo.html_url,
                "description": repo.description,
                "language": repo.language,
                "private": repo.private,
            }
        except Exception as e:
            print(f"Error fetching repository info: {str(e)}")
            return None

    def check_repository_access(self, repo_url: str) -> bool:
        """Check if the authenticated user has access to the repository"""
        try:
            repo_info = self.get_repository_info(repo_url)
            return bool(repo_info)
        except Exception:
            return False

    def get_repository_content(self, repo_url: str, path: str = "", ref: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """Get repository content at a specific path"""
        try:
            repo = self.github.get_repo(repo_url)
            contents = repo.get_contents(path, ref=ref)
            
            if isinstance(contents, list):
                return {
                    "type": "directory",
                    "contents": [
                        {
                            "name": content.name,
                            "path": content.path,
                            "type": "directory" if content.type == "dir" else "file",
                            "size": content.size if content.type == "file" else None,
                        }
                        for content in contents
                    ]
                }
            else:
                return {
                    "type": "file",
                    "content": contents.decoded_content.decode(),
                    "size": contents.size,
                }
        except Exception as e:
            print(f"Error fetching repository content: {str(e)}")
            return None