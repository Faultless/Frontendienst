// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Actions sets GITHUB_REPOSITORY to "owner/repo" automatically, so the
// Pages URL/base path resolve on their own — no need to hardcode a username.
// Exception: if this repo IS your user/org page (named "<owner>.github.io"),
// it's served from the domain root, so base must be "/" — see README.
const ghRepo = process.env.GITHUB_REPOSITORY;
const [owner, repo] = ghRepo?.split('/') ?? [];
const isUserSite = repo?.endsWith('.github.io');

// https://astro.build/config
export default defineConfig({
  site: owner ? `https://${owner}.github.io` : undefined,
  base: repo && !isUserSite ? `/${repo}` : '/',
});
