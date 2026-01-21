# Polyform

> AI-Powered Content Processing Suite built with React, TypeScript, and Google Gemini AI.

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-5.1.0-000000?logo=express)](https://expressjs.com/)

## Overview

Polyform transforms document workflows through AI-powered translation, summarization, quiz generation, and interactive chat capabilities—all with native LaTeX support.

## Features

| Feature | Description |
|---------|-------------|
| **Translation** | Multi-language support (14+ languages) with LaTeX preservation |
| **Summarization** | Customizable length options: short, medium, detailed |
| **Quiz Generation** | Adaptive difficulty with 3-20 questions per quiz |
| **Document Chat** | Contextual AI conversations about uploaded content |
| **LaTeX Rendering** | Full mathematical notation support |

## Quick Start

### Prerequisites

- Node.js v18+
- Google Gemini API Key

### Installation

```bash
# Clone and install
git clone https://github.com/RandomArtist22/Poly-Form.git
cd Poly-Form
npm install

# Configure environment
echo "GEMINI_API_KEY=your_api_key" > .env
echo "GEMINI_API_KEY=your_api_key" > backend/.env

# Start development server
npm run dev
```

The application runs on `http://localhost:5173` (frontend) and `http://localhost:3001` (backend).

## Deployment

### Vercel

1. Import repository to Vercel
2. Add `GEMINI_API_KEY` in Project Settings → Environment Variables
3. Deploy automatically

### Manual

```bash
npm run build
# Deploy dist/ folder to static hosting
# Deploy api/ folder to serverless platform
```

## Tech Stack

**Frontend:** React 18, TypeScript, Tailwind CSS, Vite  
**Backend:** Node.js, Express.js, Google Gemini AI  
**Utilities:** PDF.js, Lucide React

## Project Structure

```
Poly-Form/
├── src/
│   ├── components/    # React components
│   ├── api.ts         # API client
│   └── App.tsx        # Main application
├── api/               # Vercel serverless functions
├── backend/           # Express development server
└── public/            # Static assets
```

## License

MIT © 2026

---

**Polyform** — Transform content with AI.
