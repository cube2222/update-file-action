const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  const githubToken = core.getInput('github-token');
  const octokit = github.getOctokit(githubToken);
  const targetFilePath = core.getInput('target-file-path');
  const content = core.getInput('content');

  let sha = null;
  try {
    const {data: file} = await octokit.repos.getContent({
      owner: 'cube2222',
      repo: 'testing-spacelift',
      path: targetFilePath,
    });
    sha = file.sha
  } catch (error) {
    if (error.message === "Not Found") {
      console.log("didn't find the file")
    }
    core.setFailed(error.message);
  }
  console.log(`found sha: ${sha}`);
}

run();
