const { Octokit } = require("@octokit/rest");

exports.handler = async (event) => {
  // 1. Safety check for the HTTP method
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { title, date, summary, slug, photos } = JSON.parse(event.body);
    
    // 2. Ensure the token exists
    if (!process.env.GITHUB_TOKEN) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: "GITHUB_TOKEN is not defined in Netlify" }) 
      };
    }

    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    // 3. Construct the Markdown content
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

    // 4. Send to GitHub
    await octokit.repos.createOrUpdateFileContents({
      owner: 'Symptom7489',
      repo: 'pack156',
      path: `adventures/${slug}.md`, 
      message: `Create adventure: ${title}`,
      content: Buffer.from(content, 'utf8').toString('base64'), // Specify utf8
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ success: true }),
    };

  } catch (error) {
    console.error("Error creating adventure:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};