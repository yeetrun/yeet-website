# Website Agent Notes

The manual and changelog are authored in yeetrun/yeet-os under yeet/website/docs. This repository publishes the website. Refresh its docs from the released manual as described in README.md.

## Local Rules

- Use `STYLEGUIDE.md` as the writing and information-architecture baseline for
  public docs work.
- Update docs when user-facing CLI commands, flags, workflows, or behavior
  change.
- Keep screenshots and referenced images current when UI, homepage, or
  workflow documentation changes. If a page references an existing screenshot,
  refresh that asset in the same work session or document why it is still
  accurate.
- Keep changelog entries date-first, release-version second, and limited to
  1-3 user-facing bullets.
- Make the latest changelog entry stand alone for users installing or upgrading.
  It should explain the actual behavior, compatibility, reliability, or action
  change without requiring the reader to inspect earlier versions.
- For corrective releases, carry the real user-facing changes forward into the
  new latest entry and mark the prior bad version as superseded when useful.
  Do not make tag repair, git hashes, submodule pointers, CI retries, or website
  publication mechanics the changelog message.
- Use plain user-facing language. Avoid internal refactor details in release
  notes.
- Keep examples generic. Do not publish private hostnames, service names, local
  paths, or infrastructure details.

## Tests

- Run `git -C website diff --check` from the root repository after docs edits.
- Run the website's local checks when changing build or site behavior.
- Verify the published Cloudflare build after landing a website change.

## Related Context

- Root release policy: `../AGENTS.md`
- Docs skill: `../.codex/skills/yeet-docs/SKILL.md`
- Release skill: `../.codex/skills/yeet-release/SKILL.md`
