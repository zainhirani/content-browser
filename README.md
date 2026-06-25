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
| Data fetching  | TanStack React Query v5 + axios |
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

The catalog's non-UI core is packaged as a **module** (`modules/catalog`) exposed through a single barrel, and the UI is **feature-sliced** (`features/catalog`, `features/player`). Together they form a one-directional dependency chain — UI → module hooks → API client → HTTP route → business logic → data access — so any layer can be swapped without touching the ones above it.

Leaf folders expose a barrel `index.ts`, so imports are folder-level (`@/components/ui`, `@/hooks`, `@/lib`, `@/modules/catalog`, …) rather than reaching into individual files. (The lone exception is the axios instance, imported directly as `@/utils/axios`.)

```
src/
├── app/                              # Next.js routes only (thin)
│   ├── api/{titles, titles/[id], categories}/route.ts   # HTTP boundary (BFF) → @/modules/catalog
│   ├── title/[id]/{page, not-found}.tsx
│   ├── loading.tsx                   # app-level loader during route transitions
│   ├── error.tsx                     # app-level error boundary with retry
│   └── page · layout · providers · globals.css
│
├── modules/
│   └── catalog/                      # catalog module — index.ts barrel re-exports:
│       ├── service.ts                #   server business logic: list/search/filter/paginate, lookup, param parsing
│       ├── api.ts                    #   browser HTTP client (uses @/utils/axios): getTitles / getTitle / getCategories
│       ├── queries.ts                #   React Query hooks: useTitles (infinite), useTitle, useCategories
│       ├── repository.ts             #   data-access seam (reads @/constants)
│       └── types.ts                  #   Title, Category, CatalogQuery, TitleListResult, Filters
│
├── features/                         # UI, feature-sliced (each folder has a barrel)
│   ├── catalog/
│   │   ├── components/               #   content-card, content-grid, search-bar, category-filter, continue-watching-row
│   │   └── views/                    #   browse-view, title-detail-view (page-level orchestration)
│   └── player/
│       └── components/video-player.tsx   # presentational; lifecycle lives in @/hooks/use-hls-player
│
├── utils/axios.ts                    # the single axios instance + request/response interceptors
├── components/ui/                    # shared primitives: button, input, badge, spinner, states
├── hooks/                            # shared hooks: use-debounced-value, use-continue-watching, use-hls-player
├── lib/                              # format, continue-watching (localStorage), helper (hls.js capability check)
├── constants/                        # catalog.ts (mock data source), constants.tsx (CATEGORIES)
├── types/                            # player.types.ts
└── tests/                            # catalog.service.test.ts
```

### Request flow

```
view (features/) → React Query hook (modules/catalog/queries) → modules/catalog/api → @/utils/axios ──HTTP──▶ app/api/* route
                                                                                                                  │
                                                                     modules/catalog/service (business logic)
                                                                                                                  │
                                                                     modules/catalog/repository (data access)
                                                                                                                  │
                                                                     constants/catalog (mock data source)
```

### Why this split?

The brief asked for decoupled, independently-replaceable modules rather than a monolith. Concretely:

- **The catalog module hides its internals behind one barrel.** Routes, views, and tests import only `@/modules/catalog`; how it splits types / data access / server logic / HTTP client / query hooks internally is private and can change without rippling out.
- **Business rules live in one place** (`modules/catalog/service.ts`) — search/filter/paginate/lookup/param-parsing — defined once and unit-tested with no React or HTTP.
- **The data source is replaceable.** `repository.ts` is the only thing that knows where titles come from; today it reads `constants/catalog.ts`, tomorrow a DB or a TMDB client + mapper — nothing above it changes.
- **The transport is replaceable.** Views never make HTTP calls directly; they go through the module's hooks (`queries.ts`) → its HTTP client (`api.ts`) → a single configured axios instance (`@/utils/axios`). A **response interceptor** unwraps `response.data` (so callers get the body, not the `AxiosResponse`) and normalises failures into a rejected error React Query can render; a **request interceptor** is the single seam for headers/auth. The API routes are a **backend-for-frontend** that keeps any future provider key server-side.
- **UI is feature-sliced.** `features/catalog` and `features/player` own their components/views; genuinely cross-cutting pieces live in `components/ui`, `hooks`, and `lib`.
- **The player is a bounded context.** `lib/helper` decides native-HLS vs hls.js, `use-hls-player` owns the lifecycle, and `video-player` stays presentational.

> **Note on the catalog's two homes:** the catalog spans `modules/catalog` (its non-UI core) and `features/catalog` (its UI). The module is the stable, importable contract; the feature folder is just where its screens live.

## Key decisions & trade-offs

- **Mock data over TMDB.** I used a curated local catalog so the app runs offline with zero API keys and deterministic results, but structured it behind the `repository` boundary so wiring in a real provider is a one-file change. Trade-off: a fixed, small catalog.
- **Rendering strategy.**
  - **Detail pages are statically generated** (`generateStaticParams`). The catalog is known at build time, so pre-rendering gives fast, cacheable loads and good SEO/metadata per title. On the server the page calls the catalog module *directly* (`getTitleById` / `getAllTitleIds`, no HTTP hop) and passes the result to the client view as React Query `initialData`, so there's no loading flash.
  - **The browse page is a static shell with client-side data fetching.** Search/filter are inherently interactive, and React Query gives instant, cached, debounced updates with `keepPreviousData` so the grid doesn't flash on each keystroke.
- **API routes are still used by the browse page** even though server components *could* call the module directly. Keeping a real HTTP boundary demonstrates the logic/transport separation and makes the client data layer realistic (loading/error/retry).
- **Continue watching stores a minimal slice** (id, title, thumbnail, progress) rather than the whole title, guarded for SSR and corrupt JSON. Progress is throttled to ~5s writes. Reopening a title **resumes from the saved fraction**: the player seeks on `loadedmetadata` (when `duration` is known for both native and hls.js playback) and only once per mount, so it never fights the user's own seeking. Positions past 95% are treated as finished and start from the beginning. Trade-off: it's best-effort and per-browser, not synced.
- **hls.js + native HLS.** Safari plays `.m3u8` natively; everywhere else hls.js (via Media Source Extensions) handles it. The player surfaces only *fatal* errors so transient network hiccups don't blank the UI. The in-player loading overlay is opaque on purpose, so the browser's own buffering spinner doesn't show through as a second loader.
- **Navigation feedback via `app/loading.tsx`.** Clicking a card triggers a client-side route transition; the App Router shows this app-level loader instantly while the destination renders, then unmounts before the page paints — so it never coexists with the video's own loader.
- **Pagination via "Load more" (infinite query), not numbered pages.** The catalog API is paginated (`page`/`pageSize`) and the client uses React Query's `useInfiniteQuery`. "Load more" suits an image grid better than numbered pages and keeps already-loaded cards on screen. Trade-off vs. auto infinite-scroll: an explicit button is more predictable and accessible.

## Testing

`src/tests/catalog.service.test.ts` covers the catalog module's core logic (`modules/catalog/service.ts`): search, category filter, combined AND semantics, pagination (page boundaries, `hasMore`), lookup-by-id, and param validation — tested directly, without spinning up the framework.