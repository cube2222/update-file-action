const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  const githubToken = core.getInput('github-token');
  const octokit = github.getOctokit(githubToken);
  const targetFilePath = core.getInput('target-file-path');
  const content = core.getInput('content');
  const shouldDelete = core.getInput('delete') === "true";

  let sha = null;
  try {
    const {data: file} = await octokit.repos.getContent({
      owner: 'cube2222',
      repo: 'octosql',
      path: targetFilePath,
    });
    sha = file.sha
  } catch (error) {
    // When deleting, we need the file to exist.
    // Otherwise, the SHA isn't required.
    if (error.message !== "Not Found" || shouldDelete) {
      core.setFailed(error.message);
      return;
    }
  }
  console.log(`found sha: ${sha}`);
}

run();
