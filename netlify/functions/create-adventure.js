const { Octokit } = require("@octokit/rest");

exports.handler = async () => {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  try {
    console.log("Attempting simple connection test...");

    await octokit.repos.createOrUpdateFileContents({
      owner: 'Symptom7489',
      repo: 'pack156',
      path: 'adventures/connection-test.md', // Simple path
      message: 'Testing Netlify to GitHub connection',
      content: Buffer.from('# Connection Successful!\n\nIf you see this, the API works.', 'utf8').toString('base64'),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "File created!" }),
    };
  } catch (error) {
    console.error("GitHub API Error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};