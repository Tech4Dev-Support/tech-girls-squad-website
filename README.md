# Tech Girls Squad Website

The website for **Tech Girls Squad**, an advocacy book published by Tech4Dev in 2025 and delivered through Women Techsters. The book introduces girls across Africa to STEM through story.

This is a single scrolling page with five sections, plus a small number of supporting pages.

---

## Documents

Read both before starting. The PRD is the source of truth for behaviour and requirements; the copy document is the source of truth for wording.

| Document | Link |
|---|---|
| Product Requirements (PRD) | [https://docs.google.com/document/d/1ZlKlwzLRUlD3zrmznvNwt4YrLNW1eY01/edit?usp=sharing&ouid=108234791799607865043&rtpof=true&sd=true] |
| Website Copy | [https://docs.google.com/document/d/1wifW9wCbn_ajPOeE2bTIt7pN6uA8jEN-/edit?usp=drive_link&ouid=108234791799607865043&rtpof=true&sd=true] |
| Figma designs | [https://www.figma.com/design/lNEG6EV9YfSCgZoUEyNy3g/Tech-Girls-Squad-Website?node-id=0-1&t=1hXe7EMDDhRDLTYI-1] |

Requirements in the PRD are numbered (`FR-1`, `NFR-1` and so on). Reference them in pull requests and questions rather than describing them.

**Do not change copy in code.** If wording looks wrong, raise it with the project manager. The copy document is approved and changes go through him.

---

## Stack

| | |
|---|---|
| Framework | Next.js with React and TypeScript |
| Styling | Tailwind CSS |
| Forms | Netlify Forms |
| Hosting | Netlify |
| Motion | CSS transitions plus one scroll library (GSAP ScrollTrigger or Lenis) |
| Payment | Gateway SDK, provider TBC |

No WebGL, no 3D. Out of reach for the timeline and too heavy for the devices most of our visitors use.

---

## Getting started

```bash
git clone https://github.com/Tech4Dev-Support/tech-girls-squad-website.git
cd tech-girls-squad-website
npm install
npm run dev
```

Runs at `http://localhost:3000`.

### Environment variables

Copy `.env.example` to `.env.local` and fill in the values. Ask the project manager for anything you don't have.

**Never commit secrets.** Payment gateway keys and API credentials live in Netlify environment variables. A key committed to a private repository is still a key that has to be rotated.

---

## How we work

### Branching

`main` is always deployable. Nobody pushes to it directly.

```
main
 └── feature/hero-section
 └── feature/partner-form
 └── fix/mobile-nav-overlap
```

Branch names: `feature/short-description` or `fix/short-description`, lowercase with hyphens.

> Branch protection isn't enforced on this repository because of the GitHub plan we're on. The rule stands regardless. Everything goes through a pull request.

### Commit messages
 
Prefix with the type of change, then a short description in the present tense.
 
```
feat: add hero section
fix: correct anchor offset behind sticky header
docs: update setup instructions
style: format impact section
refactor: extract card component
chore: bump dependencies
```
 
| Prefix | Use for |
|---|---|
| `feat` | New functionality |
| `fix` | Bug fixes |
| `docs` | Documentation only |
| `style` | Formatting, whitespace, no logic change |
| `refactor` | Restructuring without changing behaviour |
| `chore` | Tooling, config, dependencies |
 
Nobody is going to police this. It just means that in week seven, when we're trying to work out when something changed, the history is readable.

### Pull requests

Open a PR into `main`. Netlify builds a preview for every PR, so put that URL in the description — it's how the work gets reviewed.

In the description, say what changed, which requirement it addresses, and anything you want a second opinion on.

Keep them small. A PR per section or per component is easier to review than one covering half the site.

### Who owns what

| Area | Owner |
|---|---|
| Design and Figma | UI/UX Designer |
| Page sections and components | Frontend Developers |
| Forms, payment, email, deployment | Backend / Full-stack Developer |
| Scope, unblocking, stakeholder comms | Project Manager |

The two frontend developers split by section, not by file. Agree component conventions with the designer in week one so you aren't building the same button twice.

### Communication

WhatsApp for day-to-day questions. Email the project manager for anything needing a decision or a record, so it doesn't get buried.

One 30-minute sync a week at a fixed time, plus written check-ins twice a week.

**Nobody is expected to reply in the evenings or at weekends.** This is a volunteer project and it needs to stay sustainable for eight weeks.

---

## Non-negotiables

These are in the PRD but are worth repeating, because they're the things most likely to be discovered too late.

**One `<h1>` on the page.** The hero headline. Section headings are `<h2>`, card titles `<h3>`. It matters for screen readers navigating a long page, and for search.

**Anchor scroll offset.** Anchor targets need padding equal to the sticky header height, or every jump lands with the section heading hidden behind the header. This is the most common defect on one-page sites.

**Deep links must work.** `/#get-involved` should load the page already scrolled to that section.

**Respect `prefers-reduced-motion`.** Smooth scroll and animations should honour the operating system setting.

**Every image lazy-loads below the fold.** The whole site loads on one page. Target is under 1.5 MB initial weight.

**Accessibility is not a final pass.** Visible focus states, visible form labels (never placeholder-as-label), keyboard operation throughout including the modals, skip-to-content link, labelled landmark regions.

**Test on a real mid-range Android.** Not just a desktop browser at a narrow width. That's what most of our visitors will be using.

---

## Targets

Lighthouse, mobile:

| | |
|---|---|
| Performance | ≥ 90 |
| Accessibility | ≥ 95 |
| Best practices | ≥ 90 |
| SEO | ≥ 90 |

---

## Timeline

| Phase | Weeks |
|---|---|
| Design | 1–2 |
| Build | 3–5 |
| Review, QA, launch | 6–8 |

---

## Questions

Ask early and ask in the group. A question asked on day two costs five minutes; the same question discovered in review costs a day.
