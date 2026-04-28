const { Octokit } = require("@octokit/rest");

exports.handler = async (event) => {
  const { title, date, summary, slug, photos } = JSON.parse(event.body);
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  // Format the YAML frontmatter
  const content = `---
layout: layouts/adventure.njk
title: "${title}"
date: ${date}
description: "${summary}"
photos:
${photos.map(p => `  - "${p}"`).join('\n')}
---

${summary}
`;

  try {
    await octokit.repos.createOrUpdateFileContents({
      owner: 'Symptom7489',
      repo: 'pack156',
      path: `src/adventures/${slug}.md`, // Adjust path to match your project
      message: `Create adventure: ${title}`,
      content: Buffer.from(content).toString('base64'),
    });

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};