# Hood Law Firm

This project is a professional website for a law firm built with modern web technologies. It combines a clean, polished user experience with several advanced features such as multilingual support, dynamic content sections, contact workflows, and a content-rich blog and careers experience.

## Overview

The website is designed to present the law firm in a professional and trustworthy way while offering a smooth browsing experience for visitors. It includes dedicated pages for the firm’s story, services, legal information, contact details, blog articles, and career opportunities.

## Key Features

- Professional and responsive design for a modern legal brand
- Multilingual experience with Arabic and English support
- Dedicated pages for About, Services, Contact, Blog, Articles, Careers, and Legal resources
- Dynamic content structure for articles and legal information
- Reading experience enhancements such as reading progress and estimated reading time
- Contact and application forms with validation and integrations
- Modern frontend architecture based on React, TypeScript, and React Router
- Server-rendered delivery for improved performance and SEO

## Tech Stack

- React 19
- TypeScript
- React Router
- Vite
- Redux Toolkit
- i18next for localization
- Drizzle ORM and SQLite
- Tailwind CSS
- ReCAPTCHA and email-related integrations

## Project Structure

```text
app/
  assets/            # Static assets and media files
  components/        # Reusable UI components
  constants.ts       # Shared frontend constants
  hooks/             # Custom React hooks
  i18n/              # Localization files and setup
  layouts/           # Main layout components
  routes/            # Page-level route components
  store/             # Redux store and slices
  utils/             # Utility helpers
  databases/         # Database schema and configuration
  routes.ts          # Application route definitions
public/             # Publicly served files
```

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm or pnpm

### Installation

Install project dependencies:

```bash
npm install

# or

pnpm install
```

### Development

Run the development server:

```bash
npm run dev

# or

pnpm dev
```

Then open your browser at http://localhost:5173.

### Production Build

Create a production build:

```bash
npm run build

# or

pnpm build
```

To start the production server after building:

```bash
npm run start

# or

pnpm start
```

### Optional Docker Usage

If you want to run the project in a container, you can use:

```bash
docker build -t hood-law-firm .
docker run -p 3000:3000 hood-law-firm
```

## License

This project is open source and is licensed under the Apache License 2.0.

You are free to use, modify, and distribute this project in accordance with the license terms, while preserving the attribution and contributor notice requirements.

The project includes contributions from its contributors, and the license applies to the codebase as a whole.

See the [LICENSE](LICENSE) file for the full text.

