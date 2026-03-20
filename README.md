# Aiti Guru — Админ-панель управления товарами

![CI](https://github.com/zotovprog/Aiti-Guru/actions/workflows/ci.yml/badge.svg)
![Deploy](https://github.com/zotovprog/Aiti-Guru/actions/workflows/deploy.yml/badge.svg)

Тестовое задание для компании [Aiti Guru](https://i-t-p.pro). React-приложение с авторизацией и таблицей товаров на базе DummyJSON API.

---

## Стек технологий

| Категория | Технология | Зачем |
|-----------|-----------|-------|
| Фреймворк | React 19 + TypeScript (strict) | Типобезопасность, современный React |
| Сборка | Vite | Быстрая сборка и HMR |
| UI-библиотека | Ant Design v6 | Table с сортировкой/пагинацией из коробки |
| Серверный стейт | TanStack Query v5 | Кэширование, рефетч, loading-стейты |
| Формы | React Hook Form + Zod v4 | Типизированная валидация |
| Роутинг | React Router v7 | Защищённые маршруты |
| HTTP-клиент | Axios | Interceptors для токенов и auto-refresh |
| Тосты | Sonner | Лёгкие уведомления |
| Иконки | Lucide React | Tree-shakeable иконки |
| Тесты | Vitest + Testing Library + MSW | Unit/integration тесты с моками API |
| Линтер | ESLint 9 + Prettier | Строгие правила, форматирование |

---

## Быстрый старт

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev

# Сборка
npm run build

# Тесты
npm run test:run

# Линтинг
npm run lint

# Форматирование
npm run format
```

**Тестовый аккаунт:** `emilys` / `emilyspass`

---

## Структура проекта

```
src/
├── api/                  # HTTP-клиент и API-функции
│   ├── axios.ts          # Axios instance + interceptors (token, 401 refresh)
│   ├── auth.api.ts       # login(), getMe(), refreshToken()
│   └── products.api.ts   # getProducts(), searchProducts(), addProduct()
├── components/
│   ├── auth/
│   │   └── LoginForm.tsx # Форма входа с валидацией и локализацией ошибок
│   ├── products/
│   │   ├── ProductsTable.tsx    # Таблица с сортировкой и пагинацией
│   │   ├── ProductsToolbar.tsx  # Тулбар: рефреш, сортировка, добавление
│   │   ├── AddProductModal.tsx  # Модалка добавления товара
│   │   ├── RatingCell.tsx       # Рейтинг (красный если < 3.5)
│   │   └── StockBar.tsx         # Прогресс-бар количества с тултипом
│   ├── layout/           # AppLayout, AuthLayout
│   └── common/           # ProtectedRoute
├── context/
│   └── auth.context.tsx  # AuthProvider — авторизация, токены, remember me
├── hooks/                # useProducts, useAddProduct (TanStack Query)
├── pages/                # LoginPage, ProductsPage
├── schemas/              # Zod-схемы валидации
├── types/                # TypeScript интерфейсы
├── utils/                # storage (localStorage/sessionStorage), constants
├── styles/               # CSS
└── __tests__/            # 56 тестов (API, компоненты, контекст)
```

---

## Как писался проект

### Методология: TDD + AI

Проект разрабатывался по методологии **Test-Driven Development** с использованием ИИ-моделей:

1. **Сначала тесты** — написаны вручную через Claude Opus 4.6
2. **Затем код** — сгенерирован через Codex GPT-5.4 (OpenAI) для прохождения тестов
3. **Ревью и доработка** — Claude Opus 4.6

### Использованные ИИ-модели

| Модель | Роль |
|--------|------|
| **Claude Opus 4.6** | Архитектура, выбор стека, написание тестов, код-ревью, настройка линтера, CI/CD |
| **Codex GPT-5.4** | Генерация кода по тестам (компоненты, API-слой, стили) |

### Навыки (Skills)

- **frontend-design** — создание качественного UI, уникальный дизайн
- **webapp-testing** — тестирование через Playwright и Vitest

### Ключевые промпты для Codex

1. **API-слой**: «Реализуй axios instance с interceptors для auto-attach токена и refresh на 401 с mutex pattern. Тесты уже написаны в `__tests__/api/`»
2. **Компоненты**: «Реализуй LoginForm с React Hook Form + Zod, remember me через localStorage/sessionStorage, локализация ошибок на русский. Тесты в `__tests__/components/LoginForm.test.tsx`»
3. **Таблица**: «Реализуй ProductsTable на antd Table с server-side сортировкой, пагинацией, чекбоксами, RatingCell (красный < 3.5), StockBar. Тесты в `__tests__/components/`»
4. **Всё приложение**: «Реализуй полное React-приложение: роутинг, страницы, провайдеры, стили по макету Figma. 39 тестов должны пройти»

### Ошибки после генерации кода и их исправления

| Проблема | Причина | Решение |
|----------|---------|---------|
| `toHaveStyle({ color: 'red' })` падал в тесте RatingCell | jsdom не поддерживает `getComputedStyle` для inline styles через jest-dom | Заменил на `element.style.color === 'red'` — прямая проверка свойства |
| Deprecated warnings в antd v6 | `pagination.position` и `Space direction` переименованы в v6 | `position` → `placement`, `direction` → `orientation` |
| Codex timeout (600s) на большой задаче | Слишком много файлов в одном промпте (все компоненты + стили) | Codex успел записать все файлы до таймаута — проверка показала что всё работает |
| «Invalid credentials» на английском | DummyJSON API возвращает английские ошибки | Добавил маппинг в `getErrorMessage()`: перевод известных сообщений на русский |
| «Network Error» на английском | Axios генерирует английские ошибки сети | Добавил в тот же маппинг перевод |
| Vite scaffold в непустой директории | `npm create vite` отказался из-за существующего CLAUDE.md | Создал в `/tmp/`, скопировал файлы |
| Неиспользуемая зависимость `@ant-design/icons` | Была установлена при скаффолдинге, но не используется | `npm uninstall @ant-design/icons` |

---

## Функциональность

- **Авторизация** — логин/пароль, валидация, ошибки на русском
- **Запомнить данные** — localStorage (сессия живёт) vs sessionStorage (умирает при закрытии)
- **Таблица товаров** — 8 колонок, server-side сортировка, пагинация
- **Поиск** — debounce 300ms, через API
- **Добавление товара** — модалка с валидацией, toast при успехе
- **Рейтинг** — красный цвет при значении < 3.5
- **Отсутствующие поля** — серый текст «Отсутствует»
- **Auto-refresh токена** — interceptor с mutex на 401

---

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск dev-сервера |
| `npm run build` | Сборка проекта |
| `npm run test` | Запуск тестов (watch) |
| `npm run test:run` | Запуск тестов (однократно) |
| `npm run lint` | ESLint проверка |
| `npm run lint:fix` | ESLint с автоисправлением |
| `npm run format` | Prettier форматирование |
| `npm run format:check` | Проверка форматирования |
