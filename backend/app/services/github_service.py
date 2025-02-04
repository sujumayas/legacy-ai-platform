"""GitHub service for repository operations"""
import requests
from urllib.parse import urlparse
import re

class GitHubService:
    def __init__(self, access_token):
        self.access_token = access_token
        self.base_url = "https://api.github.com"
        self.headers = {
            "Authorization": f"token {access_token}",
            "Accept": "application/vnd.github.v3+json"
        }

    def _parse_github_url(self, github_url):
        """Extract owner and repo name from GitHub URL"""
        if not github_url:
            return None, None

        # Handle different GitHub URL formats
        patterns = [
            r"github\.com[/:]([^/]+)/([^/]+?)(?:\.git)?/?$",  # https://github.com/owner/repo or git@github.com:owner/repo
            r"api\.github\.com/repos/([^/]+)/([^/]+?)(?:\.git)?/?$"  # https://api.github.com/repos/owner/repo
        ]

        for pattern in patterns:
            match = re.search(pattern, github_url)
            if match:
                return match.group(1), match.group(2)

        return None, None

    def get_repository_info(self, github_url):
        """Get repository information from GitHub API"""
        owner, repo_name = self._parse_github_url(github_url)
        
        if not owner or not repo_name:
            raise ValueError("Invalid GitHub URL format")

        response = requests.get(
            f"{self.base_url}/repos/{owner}/{repo_name}",
            headers=self.headers
        )

        if response.status_code != 200:
            raise Exception(f"Failed to fetch repository info: {response.json().get('message', 'Unknown error')}")

        repo_data = response.json()
        return {
            "github_url": repo_data["html_url"],
            "name": repo_data["name"],
            "owner": repo_data["owner"]["login"],
            "default_branch": repo_data["default_branch"]
        }

    def get_repository_contents(self, github_url, path=""):
        """Get repository contents at a specific path"""
        owner, repo_name = self._parse_github_url(github_url)
        
        if not owner or not repo_name:
            raise ValueError("Invalid GitHub URL format")

        response = requests.get(
            f"{self.base_url}/repos/{owner}/{repo_name}/contents/{path}",
            headers=self.headers
        )

        if response.status_code != 200:
            raise Exception(f"Failed to fetch repository contents: {response.json().get('message', 'Unknown error')}")

        return response.json()

    def scan_for_java_files(self, github_url, path=""):
        """Recursively scan repository for Java files"""
        java_files = []
        contents = self.get_repository_contents(github_url, path)
        
        for item in contents:
            if item["type"] == "file" and item["name"].endswith(".java"):
                java_files.append({
                    "path": item["path"],
                    "url": item["download_url"],
                    "size": item["size"]
                })
            elif item["type"] == "dir":
                java_files.extend(self.scan_for_java_files(github_url, item["path"]))
                
        return java_files

    def get_file_content(self, url):
        """Get content of a specific file"""
        response = requests.get(url, headers=self.headers)
        
        if response.status_code != 200:
            raise Exception(f"Failed to fetch file content: {response.text}")
            
        return response.text
