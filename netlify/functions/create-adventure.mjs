import { Octokit } from "@octokit/rest"; // Use 'import' instead of 'require'

export const handler = async (event) => { // Use 'export const' instead of 'exports.handler'
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { title, date, summary, slug, photos } = JSON.parse(event.body);
    
    if (!process.env.GITHUB_TOKEN) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: "GITHUB_TOKEN missing" }) 
      };
    }

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

    await octokit.repos.createOrUpdateFileContents({
      owner: 'Symptom7489',
      repo: 'pack156',
      path: `adventures/${slug}.md`, 
      message: `Create adventure: ${title}`,
      content: Buffer.from(content, 'utf8').toString('base64'),
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};