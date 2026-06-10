# annam.id.vn — Personal Developer Portfolio

🌐 **Live**: [annam.id.vn](https://annam.id.vn)

Modern developer portfolio built with Next.js 15, TypeScript, and Tailwind CSS.

## ✨ Features

- 🎨 **Peach & Sage** color theme with Dark/Light mode
- 🌐 **Bilingual** — Vietnamese + English (next-intl)
- 📱 **Responsive** — Mobile-first design
- ⚡ **Performance** — Lighthouse 90+ score
- 🔍 **SEO Optimized** — Metadata, sitemap, JSON-LD, Open Graph
- 📝 **Blog** — MDX-powered with syntax highlighting
- 📧 **Contact Form** — With spam protection
- 🐳 **Docker** — Multi-stage builds
- 🔄 **CI/CD** — GitHub Actions
- 📊 **Analytics** — Umami (self-hosted, privacy-respecting)
- 📲 **PWA** — Installable, offline-capable

## 🛠 Tech Stack

| Technology | Purpose |
|-----------|---------|
| Next.js 15 | Framework (App Router) |
| TypeScript | Language |
| Tailwind CSS v4 | Styling |
| next-themes | Dark/Light mode |
| next-intl | Internationalization |
| Framer Motion | Animations |
| Lucide Icons | Icons |
| React Hook Form + Zod | Form validation |
| Docker + Nginx | Deployment |
| GitHub Actions | CI/CD |

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🐳 Docker

```bash
# Build and run with Docker Compose
cd docker
docker compose up -d

# Or build standalone
docker build -f docker/Dockerfile -t annam-id-vn .
docker run -p 3000:3000 annam-id-vn
```

## 📁 Project Structure

```
src/
├── app/              # Next.js App Router
│   ├── [locale]/     # i18n pages
│   └── api/          # API routes
├── components/       # React components
│   ├── ui/           # Generic UI
│   ├── layout/       # Layout components
│   └── sections/     # Page sections
├── i18n/             # Internationalization
├── lib/              # Utilities
├── types/            # TypeScript types
└── styles/           # CSS
```

## 🌍 Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

## 📄 License

MIT © [Annam Nguyen](https://annam.id.vn)
