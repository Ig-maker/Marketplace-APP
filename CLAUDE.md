# CLAUDE.md — Marketplace APP

> Guidelines and context for AI assistants working on this codebase.

## Project Overview

Marketplace APP — a marketplace application. This repository is in its initial setup phase.

## Repository Status

This project is starting from scratch. The following sections describe the intended structure and conventions to follow as the codebase is built out.

## Development Setup

```bash
# Clone and install
git clone <repo-url>
cd Marketplace-APP
npm install        # or: yarn / pnpm install

# Start dev server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Run tests
npm test
```

## Branch Conventions

- **Main branch**: `main` (production-ready code)
- **Feature branches**: `feature/<description>` or `claude/<session-id>`
- Always create pull requests for review before merging into `main`
- Write clear, descriptive commit messages

## Project Structure (Planned)

```
Marketplace-APP/
├── CLAUDE.md              # This file — AI assistant guidelines
├── README.md              # Project documentation
├── package.json           # Dependencies and scripts
├── .env.example           # Environment variable template
├── .gitignore             # Git ignore rules
├── src/                   # Application source code
│   ├── app/               # Pages / routes
│   ├── components/        # Reusable UI components
│   ├── lib/               # Shared utilities and helpers
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript type definitions
│   └── styles/            # Global styles
├── public/                # Static assets
├── prisma/                # Database schema and migrations (if applicable)
└── tests/                 # Test files
```

## Coding Conventions

### General

- Use **TypeScript** for all source files
- Prefer **functional components** with hooks over class components
- Use **named exports** over default exports where practical
- Keep files focused — one component/module per file
- Avoid premature abstraction; keep things simple

### Naming

- **Files/directories**: kebab-case (`user-profile.tsx`, `auth-utils.ts`)
- **Components**: PascalCase (`UserProfile`, `ProductCard`)
- **Functions/variables**: camelCase (`getUserById`, `isLoading`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_RETRIES`)
- **Types/Interfaces**: PascalCase (`UserProfile`, `ProductListing`)

### Imports

- Group imports: external packages first, then internal modules, then relative imports
- Use path aliases (e.g., `@/`) for internal imports when configured

### Error Handling

- Handle errors at system boundaries (API calls, user input, external services)
- Use try/catch for async operations that can fail
- Provide meaningful error messages to users
- Don't swallow errors silently

### Styling

- Use consistent styling approach throughout the project (Tailwind CSS, CSS Modules, or styled-components)
- Follow mobile-first responsive design

## Environment Variables

- Never commit secrets or API keys
- Document all required environment variables in `.env.example`
- Use `NEXT_PUBLIC_` prefix for client-side variables (if using Next.js)

## AI Assistant Guidelines

When working on this codebase:

1. **Read before writing** — always read existing files before modifying them
2. **Minimal changes** — only change what's necessary for the task at hand
3. **No over-engineering** — keep solutions simple and focused
4. **Test your changes** — run the build and tests after making changes
5. **Don't add unnecessary dependencies** — check if existing tools can solve the problem
6. **Security first** — never introduce vulnerabilities (XSS, SQL injection, etc.)
7. **Commit often** — make small, focused commits with clear messages
8. **Ask when unsure** — if requirements are ambiguous, ask for clarification
