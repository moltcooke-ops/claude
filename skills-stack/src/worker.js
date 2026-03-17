import { collections } from "./skills.js";

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/api/collections") {
      return json(collections);
    }

    if (url.pathname.startsWith("/api/collections/")) {
      const id = url.pathname.split("/").pop();
      const col = collections.find((c) => c.id === id);
      if (!col) return json({ error: "Not found" }, 404);
      return json(col);
    }

    return new Response(renderHTML(), {
      headers: { "content-type": "text/html;charset=UTF-8" },
    });
  },
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
    },
  });
}

function renderHTML() {
  const collectionsHTML = collections
    .map(
      (col) => `
    <section class="collection">
      <div class="collection-header">
        <div>
          <h2>${esc(col.name)}</h2>
          <p class="author">by <a href="https://github.com/${esc(col.author)}" target="_blank">${esc(col.author)}</a></p>
          <p class="description">${esc(col.description)}</p>
          <div class="tags">${col.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
        </div>
        <div class="stat">${col.count} skills</div>
      </div>
      <div class="install-box">
        <code id="cmd-${esc(col.id)}">npx skills add ${esc(col.repo)} --yes</code>
        <button onclick="copyCmd('${esc(col.id)}')" title="Copy command">Copy</button>
      </div>
      <details>
        <summary>View all ${col.count} skills</summary>
        <div class="skills-grid">
          ${col.skills.map((s) => `<div class="skill-card"><strong>${esc(s.name)}</strong><p>${esc(s.description)}</p></div>`).join("")}
        </div>
      </details>
    </section>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Claude Code Skills Stack</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #0a0a0a;
      color: #e0e0e0;
      line-height: 1.6;
    }

    .container { max-width: 900px; margin: 0 auto; padding: 2rem 1.5rem; }

    header {
      text-align: center;
      padding: 3rem 0 2rem;
      border-bottom: 1px solid #222;
      margin-bottom: 2rem;
    }

    header h1 {
      font-size: 2.2rem;
      background: linear-gradient(135deg, #c084fc, #818cf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.5rem;
    }

    header p { color: #888; font-size: 1.1rem; }

    .badge {
      display: inline-block;
      background: #1a1a2e;
      border: 1px solid #333;
      border-radius: 20px;
      padding: 0.3rem 1rem;
      margin-top: 1rem;
      font-size: 0.85rem;
      color: #a78bfa;
    }

    .collection {
      background: #111;
      border: 1px solid #222;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .collection-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .collection h2 { font-size: 1.4rem; color: #f0f0f0; }

    .author { font-size: 0.9rem; color: #888; margin: 0.2rem 0 0.5rem; }
    .author a { color: #818cf8; text-decoration: none; }
    .author a:hover { text-decoration: underline; }

    .description { color: #aaa; margin-bottom: 0.8rem; }

    .stat {
      background: #1a1a2e;
      border: 1px solid #333;
      border-radius: 8px;
      padding: 0.5rem 1rem;
      font-size: 1.1rem;
      font-weight: 600;
      color: #a78bfa;
      white-space: nowrap;
    }

    .tags { display: flex; gap: 0.4rem; flex-wrap: wrap; }

    .tag {
      background: #1a1a1a;
      border: 1px solid #333;
      border-radius: 4px;
      padding: 0.15rem 0.5rem;
      font-size: 0.75rem;
      color: #888;
    }

    .install-box {
      display: flex;
      align-items: center;
      background: #0d0d0d;
      border: 1px solid #333;
      border-radius: 8px;
      padding: 0.8rem 1rem;
      margin: 1rem 0;
      gap: 0.8rem;
    }

    .install-box code {
      flex: 1;
      font-family: "SF Mono", "Fira Code", monospace;
      font-size: 0.9rem;
      color: #c084fc;
      overflow-x: auto;
    }

    .install-box button {
      background: #1a1a2e;
      border: 1px solid #444;
      border-radius: 6px;
      color: #e0e0e0;
      padding: 0.4rem 1rem;
      cursor: pointer;
      font-size: 0.85rem;
      white-space: nowrap;
      transition: background 0.2s;
    }

    .install-box button:hover { background: #2a2a4e; }

    details { margin-top: 0.5rem; }

    summary {
      cursor: pointer;
      color: #818cf8;
      font-size: 0.9rem;
      padding: 0.3rem 0;
    }

    summary:hover { color: #a78bfa; }

    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 0.8rem;
      margin-top: 1rem;
    }

    .skill-card {
      background: #0d0d0d;
      border: 1px solid #222;
      border-radius: 8px;
      padding: 0.8rem;
    }

    .skill-card strong { color: #c084fc; font-size: 0.9rem; }
    .skill-card p { color: #888; font-size: 0.8rem; margin-top: 0.3rem; }

    .how-to {
      background: #111;
      border: 1px solid #222;
      border-radius: 12px;
      padding: 1.5rem;
      margin-top: 2rem;
    }

    .how-to h2 { font-size: 1.2rem; margin-bottom: 1rem; color: #f0f0f0; }

    .step {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      align-items: flex-start;
    }

    .step-num {
      background: #1a1a2e;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      font-weight: 700;
      color: #a78bfa;
      flex-shrink: 0;
    }

    .step-text { color: #aaa; font-size: 0.95rem; }
    .step-text code { color: #c084fc; background: #1a1a1a; padding: 0.1rem 0.4rem; border-radius: 4px; font-size: 0.85rem; }

    footer {
      text-align: center;
      padding: 2rem 0;
      color: #555;
      font-size: 0.85rem;
      border-top: 1px solid #222;
      margin-top: 2rem;
    }

    footer a { color: #818cf8; text-decoration: none; }
    footer a:hover { text-decoration: underline; }

    @media (max-width: 600px) {
      .collection-header { flex-direction: column; gap: 0.8rem; }
      .skills-grid { grid-template-columns: 1fr; }
      header h1 { font-size: 1.6rem; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>Claude Code Skills Stack</h1>
      <p>Curated skill collections for Claude Code &mdash; install in one command</p>
      <div class="badge">100% Free &middot; Open Source &middot; Powered by Cloudflare Workers</div>
    </header>

    ${collectionsHTML}

    <section class="how-to">
      <h2>How it works</h2>
      <div class="step">
        <div class="step-num">1</div>
        <div class="step-text">Copy the install command for any collection above</div>
      </div>
      <div class="step">
        <div class="step-num">2</div>
        <div class="step-text">Run it in your project directory &mdash; skills are installed via <code>npx skills add</code></div>
      </div>
      <div class="step">
        <div class="step-num">3</div>
        <div class="step-text">Skills are saved to <code>.agents/skills/</code> and symlinked into <code>.claude/skills/</code></div>
      </div>
      <div class="step">
        <div class="step-num">4</div>
        <div class="step-text">Use them directly in Claude Code &mdash; they're available as slash commands</div>
      </div>
    </section>

    <section class="how-to">
      <h2>Add your own collection</h2>
      <div class="step">
        <div class="step-num">1</div>
        <div class="step-text">Create a GitHub repo with skills in <code>.agents/skills/</code> format</div>
      </div>
      <div class="step">
        <div class="step-num">2</div>
        <div class="step-text">Add your collection to <code>src/skills.js</code> in this project</div>
      </div>
      <div class="step">
        <div class="step-num">3</div>
        <div class="step-text">Deploy with <code>npx wrangler deploy</code> &mdash; free on Cloudflare Workers</div>
      </div>
    </section>

    <footer>
      Built with Cloudflare Workers (free tier) &middot;
      <a href="https://github.com/anthropics/claude-code" target="_blank">Claude Code</a>
    </footer>
  </div>

  <script>
    function copyCmd(id) {
      const code = document.getElementById('cmd-' + id);
      navigator.clipboard.writeText(code.textContent).then(() => {
        const btn = code.nextElementSibling;
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = 'Copy', 1500);
      });
    }
  </script>
</body>
</html>`;
}

function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
