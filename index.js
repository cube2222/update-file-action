const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  const githubToken = core.getInput('github-token');
  const octokit = github.getOctokit(githubToken);

  const owner = core.getInput('owner');
  const repository = core.getInput('repository');

  const targetFilePath = core.getInput('target-file-path');
  const message = core.getInput('commit-message');

  const content = core.getInput('content');
  const shouldDelete = core.getInput('delete') === "true";

  let sha = null;
  try {
    const {data: file} = await octokit.repos.getContent({
      owner: owner,
      repo: repository,
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
  try {
    if (shouldDelete) {
      await octokit.repos.deleteFile({
        owner: owner,
        repo: repository,
        path: targetFilePath,
        message: message,
        sha: sha,
      });
    } else {
      if (sha == null) {
        await octokit.repos.createOrUpdateFileContents({
          owner: owner,
          repo: repository,
          path: targetFilePath,
          message: message,
          content: content,
        });
      } else {
        await octokit.repos.createOrUpdateFileContents({
          owner: owner,
          repo: repository,
          path: targetFilePath,
          message: message,
          content: content,
          sha: sha,
        });
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
