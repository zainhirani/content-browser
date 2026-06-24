# Content Browser

A small video-streaming "content browser" built with **Next.js (App Router) + TypeScript**. Browse a catalog of titles, search and filter them, open a detail page, and play an HLS (`.m3u8`) stream.

## Features

- **Browse page** — responsive, mobile-first grid of content cards (thumbnail, title, year, category, rating, score).
- **Search** — debounced title search that filters the grid.
- **Category filter** — combined with search using AND semantics.
- **Pagination** — "Load more" backed by React Query's infinite query, with a "Showing X of Y" count.
- **Detail page** — its own route (`/title/[id]`) with full metadata.
- **HLS video player** — plays `.m3u8` streams using native HLS where available (Safari) and [hls.js](https://github.com/video-dev/hls.js) everywhere else.
- **Loading & error states** — an app-level navigation loader (`loading.tsx`), an app-level error boundary (`error.tsx`) with retry, grid skeletons, a single in-player video loader, empty states, retry buttons, and a 404 page for unknown titles.
- **Continue watching** — a row persisted in `localStorage` that tracks playback progress per title, and **resumes from the saved position** when you reopen a title.
- **Accessibility** — semantic landmarks, labelled controls, a radio-group category filter, visible focus rings.

## Tech stack

| Concern        | Choice                          |
| -------------- | ------------------------------- |
| Framework      | Next.js 14 (App Router)         |
| Language       | TypeScript (strict)             |
| Data fetching  | TanStack React Query v5         |
| Styling        | Tailwind CSS                    |
| Video          | hls.js + native HLS             |
| Testing        | Vitest + Testing Library        |

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build (statically generates detail pages)
npm run typecheck  # tsc --noEmit
npm run test       # run unit tests
npm run lint       # next lint
```

## Architecture

The code is organised **feature-first** (a feature owns its components/hooks/services/types) on top of a one-directional **clean-architecture** dependency chain. Each layer only knows about the one below it, so any layer can be swapped without touching the others.

```
src/
├── app/                       # Next.js routes only (thin)
│   ├── api/{titles,titles/[id],categories}/route.ts   # HTTP boundary (BFF)
│   ├── title/[id]/{page,not-found}.tsx
│   ├── loading.tsx            # app-level loader shown during route transitions
│   ├── error.tsx              # app-level error boundary with retry
│   └── {page,layout,providers,globals.css}
│
├── features/
│   ├── catalog/               # browse/search/filter/detail domain
│   │   ├── components/        # content-card, content-grid, search-bar, category-filter, …
│   │   ├── hooks/             # use-titles (infinite), use-title, use-categories, use-continue-watching
│   │   ├── services/          # catalog.service.ts — business logic (search/filter/paginate/suggest)
│   │   ├── repositories/      # catalog.repository.ts — data-access seam
│   │   ├── views/             # browse-view, title-detail-view (page-level orchestration)
│   │   ├── types/ · constants/
│   └── player/                # HLS playback domain
│       ├── components/video-player.tsx     # presentational
│       ├── hooks/use-hls-player.ts         # playback lifecycle
│       ├── services/player.service.ts      # native-vs-hls.js capability policy
│       └── types/
│
├── shared/                    # cross-feature, feature-agnostic
│   ├── components/ui/         # button, input, badge, spinner, states
│   ├── hooks/                 # use-debounced-value
│   ├── lib/                   # api-client, query-keys, format
│   └── constants/             # routes
│
├── infrastructure/            # outside world
│   ├── data/catalog.data.ts            # bundled mock data source
│   └── storage/continue-watching.storage.ts   # localStorage persistence
│
└── tests/
```

### Request flow

```
view → feature hook (React Query) → shared/lib/api-client ──HTTP──▶ app/api/* route
                                                                        │
                                          catalog.service (business logic)
                                                                        │
                                          catalog.repository (data access)
                                                                        │
                                          infrastructure/data (mock source)
```

### Why this split?

The brief asked for decoupled, independently-replaceable modules rather than a monolith. Concretely:

- **Features are self-contained.** `catalog` and `player` own their components/hooks/services, so a feature can grow (or be lifted out) without rippling across `components/` and `hooks/` god-folders.
- **Business rules live in one place** (`catalog.service`), defined once and unit-tested with no React or HTTP.
- **The data source is replaceable.** `catalog.repository` is the only thing that knows where titles come from; today it reads `infrastructure/data`, tomorrow a DB or a TMDB client + mapper — nothing above it changes.
- **The transport is replaceable.** Views never call `fetch`; they go through hooks → `api-client`. The API routes are a **backend-for-frontend** that keeps any future provider key server-side.
- **The player is a bounded context.** `player.service` decides native-HLS vs hls.js, `use-hls-player` owns the lifecycle, and the component stays presentational.

> **One deliberate boundary call:** `api-client`/`query-keys` are catalog-specific but live in `shared/lib` per the agreed structure; they touch catalog types only at the type level. They could equally sit under `features/catalog/api`.

## Key decisions & trade-offs

- **Mock data over TMDB.** I used a curated local catalog so the app runs offline with zero API keys and deterministic results, but structured it behind a repository/service boundary so wiring in a real provider is a one-file change. Trade-off: a fixed, small catalog.
- **Rendering strategy.**
  - **Detail pages are statically generated** (`generateStaticParams`). The catalog is known at build time, so pre-rendering gives fast, cacheable loads and good SEO/metadata per title. On the server the page calls the catalog service *directly* (no HTTP hop) and passes the result to the client view as React Query `initialData`, so there's no loading flash.
  - **The browse page is a static shell with client-side data fetching.** Search/filter are inherently interactive, and React Query gives instant, cached, debounced updates with `keepPreviousData` so the grid doesn't flash on each keystroke.
- **API routes are still used by the browse page** even though server components *could* call the service directly. Keeping a real HTTP boundary demonstrates the service/transport separation and makes the client data layer realistic (loading/error/retry).
- **Continue watching stores a minimal slice** (id, title, thumbnail, progress) rather than the whole title, guarded for SSR and corrupt JSON. Progress is throttled to ~5s writes. Reopening a title **resumes from the saved fraction**: the player seeks on `loadedmetadata` (when `duration` is known for both native and hls.js playback) and only once per mount, so it never fights the user's own seeking. Positions past 95% are treated as finished and start from the beginning. Trade-off: it's best-effort and per-browser, not synced.
- **hls.js + native HLS.** Safari plays `.m3u8` natively; everywhere else hls.js (via Media Source Extensions) handles it. The player surfaces only *fatal* errors so transient network hiccups don't blank the UI. The in-player loading overlay is opaque on purpose, so the browser's own buffering spinner doesn't show through as a second loader.
- **Navigation feedback via `app/loading.tsx`.** Clicking a card triggers a client-side route transition; the App Router shows this app-level loader instantly while the destination renders, then unmounts before the page paints — so it never coexists with the video's own loader.
- **Pagination via "Load more" (infinite query), not numbered pages.** The catalog API is paginated (`page`/`pageSize`) and the client uses React Query's `useInfiniteQuery`. "Load more" suits an image grid better than numbered pages and keeps already-loaded cards on screen. Trade-off vs. auto infinite-scroll: an explicit button is more predictable and accessible.

## Testing

`src/tests/catalog.service.test.ts` covers the catalog service: search, category filter, combined AND semantics, pagination (page boundaries, `hasMore`), lookup-by-id, and param validation — the core logic, tested without spinning up the framework.

## Possible next steps

- Real provider (TMDB) behind the existing repository interface.
- Resume playback from the saved `continue watching` position.
- URL-synced search/filter/page state (shareable links).
- Auto infinite-scroll (IntersectionObserver) as an alternative to the "Load more" button.
