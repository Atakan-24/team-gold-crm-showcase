# Publication security and privacy

## Scope

This edition is built from a reviewed allowlist. No private `.git` directory, repository history, operational reports or raw production files are copied. Only three selected TypeScript helpers are retained, with private comments removed. Documentation is written anew.

## Excluded material

- Environment values, API keys, service-role credentials and webhook/cron secrets.
- Supabase project references, provider connection/assistant IDs and deployment-specific endpoints.
- Leads, customer and employee contact information, call recordings/transcripts and event payloads.
- Business metrics, internal incidents, strategy, prompts, runbooks and private agent instructions.
- Production migration/seed data, maintenance scripts, logs and screenshots.

## Synthetic examples

Tests use reserved example domains, invented identifiers and fictional telephone examples. There is no network client, server, database connection or message-sending path in the public helper tests.

## Verification and limits

The intended public files are reviewed separately from the private source. Secret scanning and pattern checks are useful detectors, not proof that no sensitive information can exist. Included helpers are covered by isolated tests. Production authentication, effective RLS, provider authorization and live deployment have not been independently certified.

## Rate limits and RLS

No HTTP service or database is deployed by this showcase, so it introduces neither an API rate-limit surface nor RLS policies. The production system's policies and integration credentials remain private. A runnable demo would require a separate security review.
