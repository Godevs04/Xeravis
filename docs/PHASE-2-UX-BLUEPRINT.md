# Phase 2 — Information Architecture & UX Blueprint

**Status:** Approved  
**Brand:** Xelarvis Technologies · **Tagline:** Engineering Digital Excellence. · **Domain:** xelarvis.in  

This document is the source of truth for UX architecture. **Phase 3** (UI system + React implementation) must follow this blueprint. Do not invent sections that are not mapped here.

---

## Locked decisions

| Decision | Spec |
|---|---|
| Primary CTA | **Let's Talk** → `/contact?intent=project` |
| Contact nav item | Plain text link → `/contact` (CTA remains visually primary) |
| Solutions | Primary nav mega menu; routes `/solutions`, `/solutions/[slug]` |
| Featured Projects (Home) | Map to Case Studies (`/case-studies`) for SEO |
| Insights vs Blog | Insights = hub; Blog = article index/detail under Insights |
| Mega menus | Only **Solutions**, **Services**, **Industries** |

---

## Business goals (every page must support ≥1)

1. Generate Leads  
2. Build Trust  
3. Show Technical Expertise  
4. Recruit Talent  

---

## 1. Complete Sitemap

| # | Page | URL | Primary goal(s) |
|---|---|---|---|
| 01 | Home | `/` | Leads + Trust + Expertise |
| 02 | About | `/about` | Trust + Recruit |
| 03 | Solutions index | `/solutions` | Expertise + Leads |
| 04 | Solution detail | `/solutions/[slug]` | Expertise + Leads |
| 05 | Services index | `/services` | Expertise + Leads |
| 06 | Service detail | `/services/[slug]` | Expertise + Leads |
| 07 | Industries index | `/industries` | Trust + Leads |
| 08 | Industry detail | `/industries/[slug]` | Trust + Leads |
| 09 | Insights hub | `/insights` | Expertise + Leads |
| 10 | Blog index | `/blog` | Expertise |
| 11 | Blog detail | `/blog/[slug]` | Expertise + soft Lead |
| 12 | Case studies | `/case-studies` | Trust + Expertise |
| 13 | Case detail | `/case-studies/[slug]` | Trust + Leads |
| 14 | Careers | `/careers` | Recruit |
| 15 | Job detail | `/careers/[slug]` | Recruit |
| 16 | Contact | `/contact` | Leads |
| 17 | Privacy | `/privacy-policy` | Trust (compliance) |
| 18 | Terms | `/terms` | Trust (compliance) |
| 19 | Search | `/search` | Expertise + UX |
| 20 | 404 | `not-found` | Recover → Lead/nav |
| 21 | Sitemap / Robots | `/sitemap.xml`, `/robots.txt` | SEO |

### Industry detail set (10)

Healthcare · Manufacturing · Education · Retail · Finance · Logistics · Government · Telecommunications · Energy · Real Estate  

Each industry page: **Description → Problems → Solutions → CTA**.

---

## 2. User Journeys

### A — Enterprise buyer (Lead)

Home/Service entry → Hero → Trust bar → Services or Industry → Detail → Case study / Why us → Let's Talk → Contact form → Thank-you  

**Success:** Form submit with company + need.

### B — Technical evaluator (Expertise → Trust)

Insights/Blog or Technology stack → Related service → Case study → Soft CTA (newsletter or Talk).

### C — Talent (Recruit)

Careers (culture + benefits) → Job detail → Apply form → Confirmation. Soft path: About culture → Careers.

### D — Recovery (404 / Search)

404: search + top services + Let's Talk. Search: services, industries, blogs, jobs.

---

## 3. Conversion Funnel

| Stage | Page moments | CTA copy | KPI |
|---|---|---|---|
| Awareness | Home hero | Start Your Project | CTR to contact or services |
| Interest | Trust bar, Services, Industries | Explore Services / View industry | Depth scroll, service clicks |
| Consideration | Service/Case/Process | See how we work / View project | Time on page |
| Intent | Final CTA, sticky nav CTA | Schedule a Consultation / Let's Talk | Contact visits |
| Conversion | Contact form | Send message | Form submits |
| Recruit branch | Career CTA, Careers, Job | Join Our Team / Apply | Applications |
| Expertise branch | Insights, Blog | View all insights | Returning visitors |

### Form rules

- Prefill `service` / `industry` / `intent` from query params.  
- One primary action per viewport; secondary is quieter (outline/text).  
- Never stack two equal-weight CTAs in the same band.

---

## 4. Navigation Hierarchy

### Desktop (L→R)

1. Logo → `/`  
2. **Solutions** (mega)  
3. **Services** (mega)  
4. **Industries** (mega)  
5. **Insights** (direct)  
6. **Careers** (direct)  
7. **About** (direct)  
8. **Contact** (text)  
9. **Let's Talk** (accent → `/contact?intent=project`)

### Mega menus

| Trigger | Content | Mega footer |
|---|---|---|
| Solutions | Featured themes (3–6) + short descriptor | View all solutions |
| Services | Consulting · Engineering · Cloud/DevOps · AI · Design/Staffing | View all services |
| Industries | 2×5 grid of 10 industries | Talk to an industry expert |

### Nav behavior

| State | Behavior |
|---|---|
| Over hero | Transparent / frosted; contrast for photography |
| Past hero | Solid surface; border-bottom |
| Scroll down | Hide after ~80px down |
| Scroll up | Reveal immediately |
| Focus inside nav | Always visible |
| `prefers-reduced-motion` | Instant show/hide |

### Mobile drawer

Full-screen; animated; order: **Search → Primary links → Social → Let's Talk (sticky) → Contact phone/email**. Focus trap, Escape, return focus to menu button.

### Footer

Company · Services · Industries · Resources (Insights, Blog, Case Studies, Search) · Legal · Social · Newsletter · Copyright.

---

## 5. Content Hierarchy

### Global reading rules

- Max paragraph measure ~**65ch**.  
- One H1 per page; section H2; supporting H3.  
- Every section: Purpose → Hierarchy → Spacing → CTA → Motion → Accessibility.  
- Whitespace is rhythm — every open region needs a focal element (headline, metric, or CTA).

### Home story arc

| # | Section | Purpose | Goal | CTA |
|---|---|---|---|---|
| 1 | Hero | Who / what / why | Lead | Start Your Project · Explore Services |
| 2 | Trust bar | Immediate proof | Trust | — (no competing CTA) |
| 3 | Who we are | Mission / vision / values preview | Trust | Learn more → About |
| 4 | Core services | Capability map | Expertise | Cards → service detail |
| 5 | Industry expertise | Domain fit | Trust / Lead | → industry detail |
| 6 | Why choose us | 6 advantages (timeline) | Trust | Soft link to About |
| 7 | Featured projects | Proof | Trust / Expertise | View case study |
| 8 | Technology expertise | Stack credibility | Expertise | Explore solutions |
| 9 | Development process | Reduce delivery risk | Trust | Start a project |
| 10 | Testimonials | Social proof | Trust | — |
| 11 | Insights | Thought leadership | Expertise | View all insights |
| 12 | Career CTA | Employer brand | Recruit | Open positions |
| 13 | Final CTA | Close the story | Lead | Schedule a Consultation |
| 14 | Footer | Wayfinding + newsletter | All | Subscribe |

**Hero:** Large type, minimal copy, photographic office/engineering background. No abstract blobs or fake gradients.

**Trust metrics:** Years · Projects · Countries · Clients · Support availability · Technology partners.

**Why choose us (6):** Enterprise Support · Experienced Team · Modern Technologies · Scalable Solutions · Transparent Process · Long-term Partnership.

**Process:** Discovery → Planning → UI/UX → Development → Testing → Deployment → Support.

### Page content maps

- **About:** Hero → Story → Mission → Vision → Values → Leadership → Timeline → Achievements → Technology → Culture → CTA  
- **Services index:** Listing · Categories · Search · Filters · Featured · CTA  
- **Service detail:** Overview → Challenges → Solution → Benefits → Technologies → Process → Related → FAQs → CTA  
- **Industry detail:** Description → Problems → Solutions → Related services → CTA  
- **Insights:** Featured + categories + latest → Blog  
- **Blog index:** Search · Categories · Latest · Trending · Pagination · Newsletter  
- **Blog detail:** Reading time · Author · Date · TOC · Body · Share · Related · CTA  
- **Careers:** Culture · Benefits · Openings · Hiring process · FAQs · Apply CTA  
- **Job detail:** Responsibilities · Requirements · Benefits · Apply form  
- **Contact:** Hero · Form · Offices · Map · Hours · Email · Phone · Social · FAQ  

---

## 6. UX improvements (Phase 1 → Phase 2)

| Area | Phase 1 / template gap | Phase 2 target |
|---|---|---|
| Home | Section dump | Single narrative arc |
| Nav | Always-on sticky | Transparent→solid, hide/reveal, mega menus |
| CTAs | Generic “Talk to us” | Stage-specific copy |
| Trust | Weak above fold | Trust bar after hero |
| Industries | Thin set | 10 industries with Problems→Solutions→CTA |
| Services | Static grid | Search + filters + featured |
| Proof | Icon-led | Case studies + realistic testimonials |
| Process | Bullets | Visual 7-step timeline |
| Tech | Logo soup | Interactive stack groups |
| Recruit | Footer-only | Home Career CTA + full careers UX |
| Blog | List only | TOC, reading time, share, related, newsletter |
| Contact | Form alone | Form + offices + map + hours + FAQ |
| A11y | Partial | Focus trap, reduced motion, 65ch |
| Performance | Carousel-heavy | One testimonial carousel |

### Implementation gaps to close in Phase 3

Relative to current codebase (`SiteHeader`, home `page.tsx`, `DEFAULT_NAV`):

- Mega menus; scroll-aware hide/reveal; transparent-over-hero  
- Full home story sections (trust → career → final CTA)  
- Services filters/search; expanded industries  
- Blog TOC/share; careers hiring-process block  
- Contact map/hours/FAQ completeness  

---

## Phase 3 entry criteria

Phase 3 may begin when this document is treated as approved (this file = approved).  

Phase 3 scope: visual system + React implementation that realizes this IA — not redesign of the information architecture.
