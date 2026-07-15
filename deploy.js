#!/usr/bin/env node
import { execSync } from 'node:child_process';

const run = (cmd) => execSync(cmd, { stdio: 'inherit' });
const out = (cmd) => execSync(cmd, { encoding: 'utf8' }).trim();
const ok = (cmd) => { try { execSync(cmd, { stdio: 'ignore' }); return true; } catch { return false; } };

const BRANCH = 'main';
const PAGES = 'gh-pages';
const REMOTE = 'origin';

const repoUrl = out(`git config --get remote.${REMOTE}.url`);
const slug = repoUrl.replace(/^(git@github\.com:|https:\/\/github\.com\/)/, '').replace(/\.git$/, '');
const [owner, repo] = slug.split('/');

if (ok(`git rev-parse --verify ${BRANCH}`)) {
  run(`git checkout ${BRANCH}`);
} else {
  run(`git checkout -b ${BRANCH}`);
}

run(`git add -A`);
if (ok(`git diff --cached --quiet`)) {
  console.log('No changes to commit.');
} else {
  run(`git commit -m "Deploy: ${new Date().toISOString()}"`);
}

run(`git push -u ${REMOTE} ${BRANCH}`);
run(`git push -f ${REMOTE} ${BRANCH}:${PAGES}`);

console.log(`\nDeployed.`);
console.log(`Site URL: https://${owner}.github.io/${repo}/`);
console.log(`\nOne-time setup (if you haven't yet):`);
console.log(`  https://github.com/${slug}/settings/pages`);
console.log(`  Source: "Deploy from a branch", Branch: "${PAGES}", Folder: "/ (root)"`);
