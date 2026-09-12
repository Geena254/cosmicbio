# cosmicbio

Project Title:
NASA Bioscience Knowledge Explorer

Project Summary:
Build a modern, interactive frontend for a dynamic dashboard that summarizes 608 NASA bioscience publications and enables users to explore the results of decades of biology experiments in space. The dashboard should allow users to search, filter, and visualize insights using AI-powered summaries and knowledge graphs. The target audience includes scientists, NASA managers, mission planners, and educators.

Key Objectives:

Provide an intuitive search and filter system across NASA bioscience publications.

Enable AI-powered summaries of each paper, focusing on Results and Conclusions.

Present a knowledge graph linking related experiments, outcomes, and topics.

Highlight research progress, gaps, and actionable insights for exploration missions.

Integrate metadata and links from NASA OSDR, NASA Life Sciences Library, and NASA Task Book.

Subjects / Content Categories:

Artificial Intelligence & Machine Learning

Data Management

Education

Flora & Fauna

Software

Writing & Communications

Core Features (Frontend):

Homepage / Dashboard Overview

Hero section with NASA theme (Moon/Mars background).

Quick access tiles for subject areas (AI, Flora & Fauna, etc.).

Search bar with natural language query support.

Key metrics (e.g., # of studies, years covered, knowledge gaps identified).

Search & Explore Page

Full-text search and filters (by subject, year, organism studied, mission type, experiment type).

Toggle between list view (summaries) and graph view (knowledge graph).

Each result card should display:

Title

Key findings (AI-generated summary)

Tags (subject, species, system studied)

Link to NASA resource.

Publication Detail Page

Title, authors, year, source link (OSDR, Task Book, Life Sciences Library).

Tabs for:

Summary (AI condensed results & conclusions)

Knowledge Graph (related studies, impacts, citations).

Impact on Human Spaceflight (AI-generated insights for Moon/Mars missions).

Download button for citation & export.

Visualization / Knowledge Graph

Interactive graph linking experiments, organisms, outcomes, and related fields.

Nodes clickable to drill down into related publications.

Highlight clusters of research and gaps (where few studies exist).

Insights Page

Dynamic summaries of scientific progress, knowledge gaps, and future directions.

Charts/graphs: publication trends over time, most studied organisms, etc.

Export options for reports.

UI/UX Guidelines:

Futuristic but clean NASA-inspired theme (space/galaxy background, blues, whites, accents of orange).

Responsive design (desktop, tablet, mobile).

Accessibility-friendly (WCAG 2.1 AA compliance).

Use Material UI or Tailwind CSS for consistency.

Smooth animations for transitions (graphs, cards, filters).

Dashboard layout: collapsible sidebar for filters, main content area for results/graphs.

Integration Points (Frontend should be ready for):

AI summarization API (backend will handle text mining + summarization).

Knowledge graph API (backend will expose JSON for graph rendering).

NASA OSDR / Task Book / Library API endpoints.

Technical Notes:

Use React + Next.js (or standard React).

State management with Redux or Zustand.

Graph visualization with D3.js or Cytoscape.js.

Charts with Recharts or Chart.js.

Modular, reusable components for cards, filters, graphs.

Style Inspiration:

NASA’s Artemis mission branding (dark blue + white, futuristic UI).

Microsoft PowerBI dashboards (clean panels & filters).

Modern scientific dashboards (knowledge exploration vibe).

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://cosmicbio.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d7a7334f-438c-459d-a26f-9d733ef127fd).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
