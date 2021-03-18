const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    // `who-to-greet` input defined in action metadata file
    const githubToken = core.getInput('github-token');
    const octokit = github.getOctokit(githubToken)
    const targetFilePath = core.getInput('target-file-path');

    console.log(`Hello ${targetFilePath}!`);

    const {data: file} = await octokit.repos.getContent({
      owner: 'cube2222',
      repo: 'octosql',
      path: targetFilePath,
    });
    console.log(file)
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
