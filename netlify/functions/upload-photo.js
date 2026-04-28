const https = require("https");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_REPO = process.env.GITHUB_REPO; // e.g. "Symptom7489/pack156"
  const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";

  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "GitHub credentials not configured" }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const { filename, content, adventure } = body;

  if (!filename || !content || !adventure) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing filename, content, or adventure" }),
    };
  }

  // Sanitize adventure name for use as folder
  const folder = adventure.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const path = `images/adventures/${folder}/${filename}`;

  const apiPath = `/repos/${GITHUB_REPO}/contents/${path}`;

  // Check if file already exists (to get its SHA for updates)
  let sha;
  try {
    sha = await githubGet(apiPath, GITHUB_TOKEN);
  } catch {
    sha = null;
  }

  const requestBody = JSON.stringify({
    message: `Upload photo: ${filename} for ${adventure}`,
    content: content,
    branch: GITHUB_BRANCH,
    ...(sha ? { sha } : {}),
  });

  try {
    await githubPut(apiPath, requestBody, GITHUB_TOKEN);
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        path: `/images/adventures/${folder}/${filename}`,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};

function githubGet(path, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.github.com",
      path,
      method: "GET",
      headers: {
        Authorization: `token ${token}`,
        "User-Agent": "Pack156-Uploader",
        Accept: "application/vnd.github.v3+json",
      },
    };
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data).sha);
        } else {
          reject(new Error("Not found"));
        }
      });
    });
    req.on("error", reject);
    req.end();
  });
}

function githubPut(path, body, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.github.com",
      path,
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "User-Agent": "Pack156-Uploader",
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    };
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`GitHub API error: ${res.statusCode} — ${data}`));
        }
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}