interface GitHubCommitResult {
  success: boolean;
  committedToGithub: boolean;
  commitSha?: string;
  error?: string;
}

export async function commitContentToGitHub(
  filePath: string,
  newContentJsonString: string,
  commitMessage: string
): Promise<GitHubCommitResult> {
  const token = process.env.GITHUB_TOKEN?.trim();
  const repo = process.env.GITHUB_REPO?.trim() || 'kliniksilankartal/silankartal-web';
  const branch = process.env.GITHUB_BRANCH?.trim() || 'main';

  if (!token) {
    // No token provided; local file save only
    return {
      success: true,
      committedToGithub: false,
      error: 'GITHUB_TOKEN tanımlanmadığı için sadece yerel dosya güncellendi.',
    };
  }

  try {
    const url = `https://api.github.com/repos/${repo}/contents/${filePath}?ref=${branch}`;

    // 1. Get existing file sha
    let sha: string | undefined;
    const getRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'Silan-Kartal-Admin-Panel',
      },
      cache: 'no-store',
    });

    if (getRes.ok) {
      const fileData = await getRes.json();
      sha = fileData.sha;
    } else if (getRes.status !== 404) {
      const errText = await getRes.text();
      return {
        success: false,
        committedToGithub: false,
        error: `GitHub SHA alınamadı (${getRes.status}): ${errText}`,
      };
    }

    // 2. Commit updated file
    // Base64 encode UTF-8 correctly
    const base64Content = Buffer.from(newContentJsonString, 'utf-8').toString('base64');

    const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Silan-Kartal-Admin-Panel',
      },
      body: JSON.stringify({
        message: commitMessage,
        content: base64Content,
        sha,
        branch,
      }),
    });

    if (!putRes.ok) {
      const errBody = await putRes.text();
      return {
        success: false,
        committedToGithub: false,
        error: `GitHub commit başarısız (${putRes.status}): ${errBody}`,
      };
    }

    const putData = await putRes.json();
    return {
      success: true,
      committedToGithub: true,
      commitSha: putData.commit?.sha,
    };
  } catch (err: any) {
    return {
      success: false,
      committedToGithub: false,
      error: err.message || 'GitHub API bağlantı hatası.',
    };
  }
}
