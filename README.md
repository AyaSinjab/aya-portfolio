# Aya's Portfolio

A cinematic 3D portfolio built with Three.js, featuring a scroll-driven 
camera journey through a low-poly floating island world. Each island 
represents a project, guiding visitors through my work as they scroll.

🌐 **Live site:** [aya-portfolio.vercel.app](https://aya-portfolio-one.vercel.app/)

---

## Features

- Scroll-driven cinematic camera journey using GSAP ScrollTrigger
- Custom low-poly 3D assets modelled and rigged in Blender, exported as GLB
- Unified palette (Blueberry, Violet, Buttercream, Meringe) across all assets
- Frosted glass UI panels with fade animations tied to scroll position
- Animated loading screen with floating geometric shapes
- Intro and outro full-screen overlays with word-by-word fade animations
- Embedded looping film preview for the Seed of Hope project
- Procedural starfield and GLSL gradient sky shader

---

## Projects Featured

**Seed of Hope** — Blender animated short film about robots saving a dying 
planet by planting glass-encased plants. Team project covering modelling, 
animation, lighting, and rendering.

**Humly Solutions** — Industry localisation work translating a web platform 
into 31 languages, including UI verification across all language variants.

**AI Chat Assistant** — Bachelor's thesis (TNM094) designing and developing 
a RAG pipeline AI assistant to help students with academic writing, built 
with React, Python, LLMs, and Figma user studies.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Three.js | 3D rendering and scene management |
| GSAP + ScrollTrigger | Scroll-driven camera and UI animations |
| Blender | 3D modelling, rigging, animation, GLB export |
| Vite | Build tool and dev server |
| Vercel | Deployment and hosting |

---

## Project Structure

```
portfolio-3d/
├── public/
│   ├── models/          # GLB assets (islands, character, platform)
│   └── SeedOfHopePreview.mp4
├── src/
│   └── main.js          # Three.js scene, scroll camera, UI animations
├── index.html           # HTML structure and CSS styles
└── package.json
```
---

## Running Locally

```bash
npm install
npm run dev
```

---

*Designed and developed by Aya Sinjab — Civil Engineering in Media 
Technology and AI, Linköping University*