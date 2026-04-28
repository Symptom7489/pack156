const { Octokit } = require("@octokit/rest");

exports.handler = async (event) => {
  // 1. Log the incoming request to see what's happening
  console.log("Function triggered with body:", event.body);

  if (!process.env.GITHUB_TOKEN) {
    console.error("ERROR: GITHUB_TOKEN is missing from Netlify environment variables!");
    return { statusCode: 500, body: JSON.stringify({ error: "Server configuration error" }) };
  }

  try {
    const { title, date, summary, slug, photos } = JSON.parse(event.body);
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    const content = `---
layout: "layouts/adventure.njk"
title: "${title}"
date: ${date}
tags: adventures
description: "${summary}"
cover_photo: "${photos[0]}"
photos:
${photos.map(p => `  - "${p}"`).join('\n')}
---

${summary}
`;

    // 2. Perform the GitHub API call
    const response = await octokit.repos.createOrUpdateFileContents({
      owner: 'Symptom7489',
      repo: 'pack156',
      path: `adventures/${slug}.md`, // Root folder path
      message: `Create adventure: ${title}`,
      content: Buffer.from(content).toString('base64'),
    });

    console.log("GitHub Response:", response.status);

    return { 
      statusCode: 200, 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true }) 
    };

  } catch (error) {
    console.error("Function Error:", error.message);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};