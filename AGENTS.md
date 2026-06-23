# Website Agent Notes

This submodule contains the yeet user manual and changelog. Changes here must
be committed and pushed inside the website repository before the root repository
commits the updated submodule pointer.

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
- Use plain user-facing language. Avoid internal refactor details in release
  notes.
- Keep examples generic. Do not publish private hostnames, service names, local
  paths, or infrastructure details.

## Tests

- Run `git -C website diff --check` from the root repository after docs edits.
- Run the website's local checks when changing build or site behavior.
- Before a root release commit, confirm `git -C website status --short --branch`
  is clean and pushed.

## Related Context

- Root release policy: `../AGENTS.md`
- Docs skill: `../.codex/skills/yeet-docs/SKILL.md`
- Release skill: `../.codex/skills/yeet-release/SKILL.md`
