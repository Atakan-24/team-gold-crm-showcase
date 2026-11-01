# Team Gold CRM — Production System Showcase

A CRM built for a real sales workflow: collect and qualify business leads, distribute work to representatives, make browser-based calls, coordinate outreach, and inspect outcomes in one dashboard.

**Sanitized portfolio edition of a private production system.** This repository presents its architecture and three selected, independently testable source excerpts. It contains no production access, customer records, recordings, or private Git history. It is a case study, not the deployable CRM.

<p align="center">
  <img src="docs/media/demo.gif" alt="One-minute walkthrough of the Team Gold CRM dashboard" width="760">
</p>

<p align="center">
  <a href="docs/media/demo.mp4"><b>▶ Full-quality video (MP4, 1 min)</b></a> ·
  <a href="docs/FEATURES.md">Feature tour</a> ·
  <a href="docs/ROLES-AND-ACCESS.md">Roles &amp; access</a>
</p>

> **About the visuals.** All screenshots and the video were captured from the private application running locally against an isolated database filled with **synthetic data**: invented businesses marked "(demo)", reserved `555-01xx` numbers and `example.com` addresses. No production record, recording or credential appears anywhere. See [publication boundaries](docs/SECURITY.md).

## At a glance

| | |
|---|---|
| Dashboard pages | 41 |
| Server API routes | 159 |
| Source files under `src/` | 589 |
| SQL migrations | 104 numbered files |
| Roles | admin · manager · agent |
| Interface languages | English, German, Arabic |

Counts are taken from the reviewed private repository; they describe the source, not the deployed state.

## Tech stack

**Next.js · React · TypeScript · Supabase/PostgreSQL · Telnyx WebRTC · Resend · Vercel**

The private project uses the Next.js App Router, server-side API routes, Supabase authentication and database clients, browser telephony, provider event handlers, and scheduled workflows.

## What problem it solves

Sales work spans disconnected lead lists, browser calls, follow-ups and outcome tracking. The CRM brings those steps into a shared workflow: ingestion and normalization, controlled lead release, assigned contact queues, calls, email outreach, and dashboard review.

## Key features in the private system

- **Lead pipeline:** authenticated ingestion, field normalization, batch tracking, enrichment and controlled release to representatives.
- **CRM workflows:** contact queues, assignments, status changes, activity timelines and role-oriented dashboards.
- **Browser calling:** Telnyx WebRTC, server-side token issuance, representative-specific telephony credentials and caller-number selection.
- **Email/outreach:** shared sending logic, editable templates, mailbox allocation, recipient deduplication and delivery-event handling.
- **Operational dashboards:** call review, recordings, costs, lead activity, team management and outreach views.
- **AI/automation:** AI-caller routes, assistant context/tools, call analysis, scheduling and approval-oriented outreach workflows. Provider configuration and operational prompts remain private.

These features are evidenced by the reviewed private source. This showcase does not certify that every route is enabled or every migration is deployed in production.

## System architecture

```mermaid
flowchart LR
    Finder[External lead collector] -->|Authenticated ingestion| API[Next.js server routes]
    Rep[Sales representative] --> UI[Next.js / React dashboard]
    UI -->|Session-authenticated requests| API
    API --> Auth[Supabase Auth]
    API --> DB[(Supabase / PostgreSQL)]
    API -->|Short-lived browser token| UI
    UI <-->|WebRTC audio| Voice[Telnyx]
    Voice -->|Provider events| API
    API --> Mail[Resend email]
    Mail -->|Delivery events| API
    Jobs[Scheduled workflows] --> API
    API --> AI[AI caller / analysis integration]
    AI --> Voice
```

The lead collector is a separate system; its implementation is not included here. The diagram is a high-level view, not an exhaustive deployment or trust-boundary map.

For a simplified API map, core data relationships and lead-to-outcome sequence, see [System walkthrough](docs/SYSTEM-WALKTHROUGH.md).

## Selected source excerpts

| Module | Why it matters |
|---|---|
| [phone.ts](src/lib/phone.ts) | Rejects phone imports without country context rather than guessing a dialing destination. |
| [normEmail.ts](src/lib/normEmail.ts) | Removes `mailto:` and display-name wrappers while preserving address content and local-part case. |
| [dedupeEmpfaenger.ts](src/lib/dedupeEmpfaenger.ts) | Keeps the first candidate per normalized recipient, preserving the original queue order. |

Executable helper logic is retained from the private system. Operational anecdotes and private examples in comments have been removed. The email normalizer removes wrappers; it is not a complete email-address validator. Phone normalization does not verify number ownership or reachability.

## Engineering challenges

- **Boundary between browser and server:** provider API secrets stay on the server; browser calling obtains a session-authorized token.
- **Safe imports:** normalization must repair known formatting problems without inventing missing country or address data.
- **Shared behavior:** dashboard and batch workflows reuse helpers so recipient selection and mail formatting do not drift.
- **Multi-representative calling:** individual telephony credentials avoid coupling browser sessions; caller identity is selected separately.
- **Schema/deployment drift:** source migrations and a successful TypeScript check do not prove the deployed database or Next.js build matches the intended state.
- **Production operations:** Vercel deployment configuration and scheduled handlers are represented at architecture level; credentials and operational runbooks are excluded.

See [engineering decisions](docs/ENGINEERING.md).

## Run the isolated examples

Node.js 24 or newer; no install, cloud accounts or environment variables required:

```sh
npm test
```

Tests cover only the included pure helpers. They do not test the private CRM, provider integrations, RLS policies or live deployment. All contact examples are invented and use reserved example domains and fictional telephone numbers. No calls or messages are sent.

## Screenshots

Captured from the private application with synthetic data. Page-by-page notes are in the [feature tour](docs/FEATURES.md).

| | |
|---|---|
| **Sign-in** with show-password toggle and DE / EN / AR switch<br><img src="docs/images/01-login.png" width="420"> | **Dashboard**: pre-shift check, shift timer, daily goal, calls worth hearing<br><img src="docs/images/02-dashboard.png" width="420"> |
| **Contacts**: lead pools, controlled pulls, CSV import/export<br><img src="docs/images/03-contacts.png" width="420"> | **Calls & SMS**: per-rep results and the calls worth hearing first<br><img src="docs/images/04-calls-activity.png" width="420"> |
| **Recordings** with business context, transcript and AI summary<br><img src="docs/images/05-recordings-transcript.png" width="420"> | **Insights**: answer rate per number, hook by website type, attempt curve<br><img src="docs/images/06-insights.png" width="420"> |

### Roles: the same page, scoped differently

An admin sees all 25 recordings. A manager opens the same page and sees only the 8 recordings of the reps they invited (see [roles and access](docs/ROLES-AND-ACCESS.md)).

<img src="docs/images/07-manager-scoped-recordings.png" alt="Manager view: recordings limited to own team" width="760">

## Security & privacy

Publication uses an explicit file allowlist, fresh repository history and synthetic examples. No environment files, service-role keys, provider credentials, production IDs, customer/employee records, call transcripts or operational notes are included. Private database migrations and provider routes are excluded.

The private source contains authentication, webhook-verification and RLS mechanisms; their presence is not a claim of complete security or verified deployment. See [publication boundaries](docs/SECURITY.md).

No open-source license is assigned yet. A license should be chosen by the owner after deciding which reuse rights to grant.
