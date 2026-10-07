# Repository overview

This is a sanitized case study of a private production CRM, with three selected pure TypeScript helpers. It is not a runnable CRM or a replacement for production.

| Path | Purpose |
|---|---|
| README.md | Recruiter-facing system overview and architectural diagram. |
| docs/ENGINEERING.md | Source-grounded decisions, challenges, and implementation limits. |
| docs/SECURITY.md | Publication boundary and privacy approach. |
| src/lib/phone.ts | International phone normalization; rejects unknown country context. |
| src/lib/normEmail.ts | Removes email-link wrappers without inventing missing address data. |
| src/lib/dedupeEmpfaenger.ts | Stable per-run recipient deduplication. |
| tests/helpers.test.mjs | Isolated tests using synthetic reserved contact details only. |
| package.json | Dependency-free local test command for Node 24+. |
| AGENTS.md | Editing conventions and privacy rules. |
| .gitignore | Local credentials and artifacts excluded. |

The three helpers have no imports or production service dependencies. Tests import them directly using Node's TypeScript support. No private repository history is included.
