# GuruAiti - Project Rules

## Code Generation
- All code tasks MUST be sent to **Codex GPT-5.4** via MCP tool (`mcp__multi-agents__codex_exec`)
- Do NOT write code directly — delegate to Codex

## Development Workflow: Test-Driven Development (TDD)
1. **Сначала пишем тесты на API** (auth, products endpoints)
2. **Затем пишем тесты на UI** (компоненты, формы, таблица)
3. **Затем пишем код через Codex** для прохождения тестов

## Tech Stack
- React 18+ / TypeScript (strict)
- Vite, Ant Design, TanStack Query, React Hook Form + Zod
- Axios, React Router v7, Sonner, Lucide React
- API: DummyJSON (Products + Auth)

## Available Skills (from /Users/andreyzotov/Downloads/skills-main/skills/)
- **frontend-design** — создание качественных UI с уникальным дизайном (избегать AI-шаблонов)
- **webapp-testing** — тестирование через Playwright (scripts/with_server.py для управления сервером)
- **web-artifacts-builder** — сборка React-артефактов (init-artifact.sh + bundle-artifact.sh)
- **canvas-design** — дизайн на canvas
- **theme-factory** — генерация тем
