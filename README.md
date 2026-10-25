# Календарь звонков

[![hexlet-check](https://github.com/madatsci/ai-for-developers-project-387/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/madatsci/ai-for-developers-project-387/actions)

Интегрируйте работу агентов в GitHub проект

- [Публичное приложение](https://calendar-of-calls-387.onrender.com)
- [Административный интерфейс](https://calendar-of-calls-387.onrender.com/admin/calls)
- [Программа Хекслета](https://ru.hexlet.io/programs/ai-for-developers)
- [Описание проекта](https://files.hexlet.app/a/2ipc5m)

Стек: Go 1.26, `net/http`, `chi`, PostgreSQL 18, Vue 3, TypeScript, Vite,
Tailwind CSS и TypeSpec.

## Запуск и настройка

Нужны Go 1.26+, Node.js 26 с npm, Docker Compose v2, GNU Make и curl.

```bash
git clone https://github.com/madatsci/ai-for-developers-project-387.git
cd ai-for-developers-project-387
make setup
make dev
```

`make dev` запускает PostgreSQL, применяет миграции и seed, затем поднимает API и
frontend.

| Сервис           | Адрес                              |
| ---------------- | ---------------------------------- |
| Frontend         | <http://127.0.0.1:5175>            |
| API health check | <http://127.0.0.1:8080/api/health> |
| PostgreSQL       | `127.0.0.1:5433`                   |

Для запуска компонентов в отдельных терминалах:

```bash
make db-up && make seed
make dev-backend   # терминал 1
make dev-frontend  # терминал 2
```

### Конфигурация

Значения для локальной разработки заданы в `Makefile`. Для переопределения
скопируйте `.env.example` в `.env`.

| Переменная         | Назначение                                    |
| ------------------ | --------------------------------------------- |
| `DATABASE_URL`     | Подключение API, миграций и seed к PostgreSQL |
| `HTTP_ADDR`        | Адрес локального Go API                       |
| `API_PROXY_TARGET` | Адрес API для Vite proxy                      |
| `FRONTEND_PORT`    | Порт локального Vite-сервера                  |
| `PORT`             | Внутренний HTTP-порт production-контейнера    |

Учётные данные `calendar/calendar` предназначены только для локальной БД.

### Контейнерный запуск

```bash
docker compose up --build --wait app
```

Приложение будет доступно на <http://127.0.0.1:8080>. Остановка с сохранением
данных:

```bash
docker compose down
```

## Деплой в Render

[`render.yaml`](render.yaml) описывает Render Web Service в регионе Frankfurt и
подключает его к существующей базе `calendar-of-calls-db`. Проекты 386 и 387
используют одни таблицы и общие данные. Render собирает корневой `Dockerfile`,
передаёт приложению `DATABASE_URL` и `PORT`, проверяет `/api/health` и публикует
сервис по HTTPS.

Для первого деплоя создайте в Render Blueprint из этого GitHub-репозитория и
выберите ветку `main`. Последующие изменения деплоятся автоматически после
успешного завершения GitHub CI.

Проверка опубликованного контура:

```bash
make smoke-remote REMOTE_SMOKE_BASE_URL=https://calendar-of-calls-387.onrender.com
```

## Проверки

```bash
make test   # Go и frontend-тесты
make check  # полная CI-эквивалентная проверка
```

## GitHub workflows

| Workflow          | Событие                                                                | Модель               | Назначение                                                                                     | Прогоны                                                                                                           |
| ----------------- | ---------------------------------------------------------------------- | -------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `CI`              | Push в `main`; pull request                                            | —                    | Полная проверка проекта через `make check`                                                     | [GitHub Actions](https://github.com/madatsci/ai-for-developers-project-387/actions/workflows/ci.yml)              |
| `hexlet-check`    | Push в любую ветку или тег                                             | —                    | Автоматическая проверка проекта платформой Хекслета                                            | [GitHub Actions](https://github.com/madatsci/ai-for-developers-project-387/actions/workflows/hexlet-check.yml)    |
| `Lighthouse`      | Ежедневно в 03:00 UTC; ручной запуск                                   | `openai/gpt-6.1-sol` | Проверяет опубликованное приложение, сохраняет Lighthouse-отчёт и создаёт issue с результатами | [GitHub Actions](https://github.com/madatsci/ai-for-developers-project-387/actions/workflows/lighthouse.yml)      |
| `opencode-review` | PR открыт, обновлён, переоткрыт или переведён в ready for review       | `openai/gpt-6.1-sol` | Ревьюит PR из этого репозитория, созданные людьми                                              | [GitHub Actions](https://github.com/madatsci/ai-for-developers-project-387/actions/workflows/opencode-review.yml) |
| `Issue Triage`    | Человек открыл issue; аккаунту не менее 30 дней                        | `openai/gpt-6-luna`  | Анализирует новый issue и при наличии полезного ответа добавляет комментарий                   | [GitHub Actions](https://github.com/madatsci/ai-for-developers-project-387/actions/workflows/opencode-triage.yml) |
| `opencode`        | Доверенный участник начинает новый комментарий с `/oc` или `/opencode` | `openai/gpt-6.1-sol` | Выполняет явно запрошенную агентскую задачу в issue или PR                                     | [GitHub Actions](https://github.com/madatsci/ai-for-developers-project-387/actions/workflows/opencode.yml)        |
| `Release Please`  | Push в `main`                                                          | —                    | Обновляет release PR и создаёт GitHub Release после его слияния                                | [GitHub Actions](https://github.com/madatsci/ai-for-developers-project-387/actions/workflows/release-please.yml)  |

Для событий комментариев GitHub создаёт запись workflow run на каждый новый
комментарий. Job `opencode` получает runner только для команды от доверенного
пользователя; остальные запуски отображаются как пропущенные.

Публичная ссылка на сессию OpenCode создаётся только для интерактивного
`opencode`, запущенного доверенным участником явной командой `/oc` или
`/opencode`. Сессии автоматических PR review, issue triage и Lighthouse не
публикуются: их итог уже доступен в комментарии или созданном issue.

Автоматическое ревью запускается по событиям pull request, но выполняется
только для PR из веток этого же репозитория, созданных не ботом. Поэтому PR,
созданные ботом или из fork, будут пропущены; условия запуска заданы в
[workflow ревью](.github/workflows/opencode-review.yml).

Lighthouse можно запустить вручную на странице workflow:
[Actions → Lighthouse → Run workflow](https://github.com/madatsci/ai-for-developers-project-387/actions/workflows/lighthouse.yml).
Подробнее о [ручном запуске workflow](https://docs.github.com/actions/managing-workflow-runs/manually-running-a-workflow).
Требуется repository variable `APP_URL` с адресом опубликованного приложения.
Если переменная не задана, сбор завершится с явной ошибкой до запуска Lighthouse.
После успешного сбора исходные отчёты доступны в артефакте
[`lighthouse-reports`](https://docs.github.com/actions/using-workflows/storing-workflow-data-as-artifacts);
затем workflow создаёт issue с результатами. Подробности — в
[workflow Lighthouse](.github/workflows/lighthouse.yml).

## Подводные камни

- Production-контейнер слушает `0.0.0.0:$PORT`; локальный API использует
  `HTTP_ADDR`.
- Контейнер применяет миграции и идемпотентный seed перед каждым запуском API.
- Проекты 386 и 387 используют одну Render PostgreSQL: изменения данных и схемы
  из одного приложения сразу влияют на другое.
- `make smoke-remote` создаёт реальный звонок и оставляет его в Render PostgreSQL.
- Источник HTTP-контракта — `api/*.tsp`. Generated OpenAPI, frontend SDK и Go
  server package нельзя редактировать вручную; для их обновления используйте
  `make generate`.
- Бесплатный Render Web Service засыпает без трафика, поэтому первый запрос после
  простоя может выполняться дольше.
- Бесплатная Render PostgreSQL имеет ограниченный срок жизни. Отключение Blueprint
  не удаляет Web Service и базу данных — эти ресурсы удаляются отдельно.

---

<details>
<summary>Автоматические тесты Хекслета</summary>

Тесты запускаются на каждый коммит. За запуск отвечает файл `.github/workflows/hexlet-check.yml` — не удаляйте и не переименовывайте ни его, ни репозиторий.

</details>

## О Хекслете

[Хекслет](https://ru.hexlet.io/) — школа программирования: авторские программы обучения с практикой, поддержкой наставников и реальными проектами, которые остаются в резюме. Этот репозиторий — один из таких проектов.
