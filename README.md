# dev-aditya.com

A premium, dark-themed engineering portfolio for **Aditya** — a Front-End Developer & UI/UX Designer based in Delhi, India.

## Overview

This is a high-performance, SEO-optimized personal portfolio website built with modern web technologies. The site positions Aditya as a serious software engineer and creative frontend builder, showcasing real shipped projects with detailed case studies.

**Live site:** [dev-aditya.com](https://dev-aditya.com)

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion
- **Smooth Scroll:** Lenis (@studio-freight/lenis)
- **Fonts:** Geist Sans + Geist Mono (via next/font)

## Pages

| Route | Description |
|---|---|
| `/` | Home — Hero, proof cards, engagements, case studies, process, CTA |
| `/work` | All projects with descriptions, tags, and links |
| `/work/saffron-steam-experience` | Case study: Saffron & Steam Immersive Café Experience |
| `/work/corporate-leadgen-platform` | Case study: B2B Lead-Gen Platform |
| `/work/driftwear-ecommerce` | Case study: Driftwear Studio E-commerce |
| `/work/real-estate-atelier` | Case study: Real Estate Atelier Luxury Advisory |
| `/about` | Background, design philosophy, tech stack |
| `/mentoring` | Project help for students and small businesses |
| `/contact` | Contact form + direct contact info |
| `/resources` | Hub for guides and checklists |
| `/resources/portfolio-checklist` | Portfolio Website Checklist |
| `/resources/ai-website-agency` | AI Website Agency Starter Notes |
| `/resources/frontend-qa` | Frontend Project QA Checklist |
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Service |
| `/accessibility` | Accessibility Statement |

## Design System

- **Background:** `#070707` (near-black)
- **Surface:** `#111111` (charcoal)
- **Text Primary:** `#F5F2EA` (warm off-white)
- **Text Muted:** `#A8A29E` (stone)
- **Accent:** `#FF7A1A` (tangerine)
- **Border:** `rgba(255,255,255,0.10)` (subtle white)
- **Typography:** Geist Sans for headings/body, Geist Mono for labels/tags/metadata

## Features

- Dark editorial design with premium spacing and typography
- Scroll-triggered reveal animations via Framer Motion
- Smooth scroll via Lenis (respects `prefers-reduced-motion`)
- Sticky header with blur effect and mobile hamburger menu
- Deep, multi-column footer with all links
- SEO metadata on every page (title, description, Open Graph)
- JSON-LD Person schema for rich search results
- Auto-generated sitemap.xml and robots.txt
- Contact form with validation, honeypot spam protection, and API route
- Copy-to-clipboard on contact info
- Fully responsive (mobile, tablet, desktop)
- Accessible: semantic HTML, keyboard nav, focus states, ARIA labels
- 404 page

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (Header, Footer, SEO, JSON-LD)
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global styles + Tailwind theme
│   ├── sitemap.ts              # Auto-generated sitemap
│   ├── robots.ts               # Robots.txt config
│   ├── not-found.tsx           # 404 page
│   ├── work/
│   │   ├── page.tsx            # Work listing
│   │   ├── WorkContent.tsx     # Work page client component
│   │   ├── saffron-steam-experience/page.tsx  # Case study 01
│   │   ├── corporate-leadgen-platform/page.tsx  # Case study 02
│   │   ├── driftwear-ecommerce/page.tsx  # Case study 03
│   │   └── real-estate-atelier/page.tsx  # Case study 04
│   ├── about/                  # About page
│   ├── mentoring/              # Project Help page
│   ├── contact/                # Contact page + form
│   ├── resources/              # Resources hub + sub-pages
│   ├── privacy/                # Privacy Policy
│   ├── terms/                  # Terms of Service
│   └── accessibility/          # Accessibility Statement
├── components/
│   ├── Header.tsx              # Sticky header + mobile menu
│   ├── Footer.tsx              # Deep footer
│   ├── SmoothScroll.tsx        # Lenis smooth scroll wrapper
│   └── CaseStudyContent.tsx    # Reusable case study template
└── lib/                        # Utilities
```

## Author

- **Aditya** — Front-End Developer & UI/UX Designer
- GitHub: [witejackel-eng](https://github.com/witejackel-eng)
- Email: hi.aditya.dev@gmail.com
- Location: Delhi, India

## License

This project is for personal portfolio use. All code is original work.