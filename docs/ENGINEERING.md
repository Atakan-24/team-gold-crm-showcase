# Engineering notes

This document describes reviewed implementation choices, not new features implemented in this edition.

## Lead ingestion and work allocation

The CRM accepts external collector output through an authenticated ingestion route. It handles multiple incoming field names, normalizes phone/email representations, attaches batch metadata, and supports administrator-controlled release rather than pushing all new records into every representative queue. The collector itself lives outside the CRM.

The public phone helper rejects missing country context for national numbers. The public email helper strips known wrappers, without adding a domain or lowercasing the stored local part. Both demonstrate how data quality affects downstream calling and delivery.

## Browser calling

An authenticated server route requests a browser telephony token. Representative-specific credentials are looked up separately from the caller-number pool. This separation reflects two different responsibilities: which representative owns the browser session, and which outbound number is selected for a call. Server API keys and provider IDs are excluded.

## Outreach consistency

Shared sending logic is used by different workflows. Recipient deduplication preserves candidate priority while suppressing repeated addresses within a run. It is not a distributed lock or a guarantee of exactly-once delivery across separate jobs.

## Events and automation

The private project includes provider event handlers, scheduled notification/analysis routes, AI-caller configuration and assistant tools, and preparation/approval/send routes for outreach. Only the architecture is presented here. No claim is made about autonomous operation, conversion rates, user counts or savings.

## Database and deployment

Supabase authentication, PostgreSQL migrations and RLS policy definitions are present in the private source. Migration files alone do not prove that the production database applied them. Vercel deployment/cron configuration is present, but no live service was queried for this review.

## Included logic versus excluded integration

Included code is limited to three pure helpers with no imports. This edition omits UI components because their data bindings and operational text require a broader redaction effort. It does not provide a synthetic imitation of the actual production dashboard.
