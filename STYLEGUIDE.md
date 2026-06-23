# Documentation Style Guide

Use this guide as the north star for public documentation. The goal is a manual
that helps a user decide what to do next, run the right command, and understand
the result without learning internal implementation details first.

## Reader

Write for people operating yeet and catch, not for contributors reading the
source tree. Assume the reader understands Linux, SSH, and services, but do not
assume they know yeet's command model yet.

Prefer:

- What the user wants to accomplish.
- The command they should run.
- What happens after the command succeeds.
- Where to go next if they need more detail.

Avoid:

- Internal package names, function names, or storage mechanics unless the user
  must act on them.
- Design rationale before a practical command.
- Long background sections before the first useful example.
- Private hostnames, local paths, or service names.

## Information Architecture

Make the top of the docs shallow and action-oriented.

- Start with the shortest successful path.
- Split by user task before splitting by implementation concept.
- Keep reference material behind overview pages and clear cross-links.
- Put advanced or optional topics after the common path.
- Make each page answer one primary question.

Good page jobs:

- Install the tools.
- Bootstrap a host.
- Deploy a service.
- Choose a payload type.
- Understand host targeting.
- Troubleshoot a known failure.
- Look up a command after the reader already knows the workflow.

Avoid pages that mix a tutorial, a conceptual essay, and a full reference. Split
that content or move reference detail lower on the page.

## Page Shape

Every page should make its purpose clear in the first screen.

Use this structure by default:

1. One-sentence purpose.
2. Prerequisites or assumptions, only when needed.
3. The smallest working example.
4. Follow-up commands or verification.
5. Notes, options, and deeper explanation.
6. Related pages.

For long pages, start with a short "Start here" or "Choose your path" section.
Do not make readers scan the whole page to find their entry point.

## Headings

Use headings as a map, not as decoration.

- Use verbs for tutorials: "Install yeet", "Bootstrap catch", "Deploy a
  container".
- Use nouns for references: "Global flags", "Network modes", "Environment
  variables".
- Keep heading levels predictable.
- Avoid clever headings. A heading should tell the reader exactly what follows.

## Tone

Use plain, direct language. Be confident, but not chatty.

Prefer:

- "Run this on your workstation."
- "Use the catch hostname after `yeet init` finishes."
- "Skip this section unless you plan to run VMs."

Avoid:

- "Simply", "just", "obviously", or similar words that minimize complexity.
- Apologies or hedging when the behavior is known.
- Sales language in manual pages.
- Contributor-facing rationale in user-facing docs.

## Tense And Voice

Use present tense and active voice.

Prefer:

- "yeet installs catch over SSH."
- "catch stores service data under the service root."
- "Run `yeet status` to confirm catch is reachable."

Avoid:

- "catch will be installed over SSH."
- "service data is stored under the service root."
- "it should be confirmed that catch is reachable."

Passive voice is allowed only when the actor does not matter to the user. If the
actor matters, name it.

## Sentences

Keep sentences short and concrete.

- Put one idea in each sentence.
- Prefer common words over precise-but-rare words.
- Keep command explanations near the command.
- Use contractions sparingly and only in conversational notes.
- Define product-specific terms once, then use them consistently.

When a sentence needs multiple commas, split it.

## Commands And Examples

Commands should be copy-pasteable unless the surrounding text says otherwise.

- Use placeholder names such as `<svc>`, `<machine-host>`, and `<catch-host>`.
- Explain whether a command runs on the workstation, the host, or inside a VM.
- Show verification after setup or destructive operations.
- Keep examples generic and safe.
- Prefer the smallest complete command over a maximal command with every flag.

Use comments inside code blocks only when they prevent a mistake. Do not narrate
obvious shell syntax.

## Conceptual Detail

Lead with the user outcome, then explain the concept.

Good:

1. "Use `--net=ts` when the service should get its own Tailscale identity."
2. "This creates a per-service tsnet node."
3. "Use this when you want private HTTPS or service-specific ACLs."

Too deep too early:

1. How the network namespace is assembled.
2. Which internal service supervises it.
3. Which generated files exist on disk.

Keep implementation detail when it helps a user debug, recover data, or make a
deployment decision. Move the rest to source comments or contributor docs.

## Notes And Warnings

Use callouts sparingly.

- Use notes for context that prevents confusion.
- Use tips for optional quality-of-life improvements.
- Use warnings for data loss, security risk, or commands that can break a
  service.
- Do not use callouts to rescue unclear page structure.

## Cross-Linking

Cross-links should reduce decisions, not create a maze.

- Link to the next likely task.
- Link to one reference page when a flag or concept needs detail.
- Avoid long "see also" lists.
- Use link text that names the destination, not "here".

## Reference Pages

Reference pages should be complete but scannable.

- Group commands by workflow, not alphabetically, unless lookup speed is the
  only goal.
- Put common commands first.
- Keep examples under each command short.
- Move rare flags into compact lists or tables.
- Do not repeat full workflow tutorials inside the reference.

## Review Checklist

Before publishing a page, check:

- The first screen tells the reader what the page is for.
- The common path appears before advanced details.
- Every command has enough context to run safely.
- Active voice and present tense dominate.
- The page avoids internal details unless the user needs them.
- Related links point to the next useful step.
- Examples use generic placeholders and no private information.
