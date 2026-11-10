# Agent guide — Treadmill Tracker

Instructions for humans and coding agents working in this repo. **When you change stack
choices, lint rules, or conventions, update this file in the same change.**

## Project

- React + TypeScript SPA (Vite). **React Router** for shell navigation (`/`,
  `/start`, `/plan`, `/run?workout=`). No backend. **PWA** via `vite-plugin-pwa`
  (web manifest, service worker, installable on mobile). Do not intercept
  `beforeinstallprompt` with `preventDefault`—that suppresses the browser’s
  native install UI. Regenerate derived icons from `public/icon-source.png` with
  `npm run pwa:icons` after icon art changes.
- Node via **mise** (`mise.toml`). Prefer `mise run <task>` over ad hoc npm scripts.

## Commands

| Task | Command |
|------|---------|
| Install | `mise run install` |
| Dev server | `mise run dev` |
| Lint | `mise run lint` |
| Build | `mise run build` |
| Regenerate PWA PNG icons | `npm run pwa:icons` |
| E2E tests | `mise run test:e2e` |
| E2E UI mode | `mise run test:e2e:ui` |
| Install Playwright browser | `mise run test:e2e:install` (once per machine) |

## Git commits and local patches

The repo root **`patches/`** directory holds **local-only** mailbox patches
(`git format-patch` output). It is listed in **`.gitignore`** and must not be
committed.

When the user asks you to **create a git commit** and the commit **succeeds**,
also export that commit as a patch:

```bash
git format-patch -1 HEAD -o patches/
```

Use `git format-patch --root -o patches/` only to rebuild the full series from
scratch (e.g. new clone), not after every commit.

## Styling (strict)

### SCSS only

- All stylesheets use **`.scss`**. Do not add `.css` files or import `.css` from
  TS/SCSS.
- Global reset/theme tokens live in `src/styles/` (e.g. `global.scss`). These
  files are **exempt** from component BEM lint rules.
- Component (or page) styles are colocated, e.g. `App.scss` next to `App.tsx`.
- Entry: `src/index.scss` loads `styles/tokens` then `styles/global`; components
  import their own `.scss`.

### Design tokens

- **Single source of truth:** `src/styles/tokens.scss` defines `:root` custom
  properties (`--color-*`, `--space-*`, `--size-*`, `--font-*`, etc.). Raw
  numbers, lengths, and hex colors live **only** in that file (and partials it
  owns).
- **Everywhere else** (component `.scss`, `global.scss`): use
  **`var(--token-name)`** only—no magic numbers or ad hoc hex/rgb.
- Add new tokens in `tokens.scss` when you need a new value; reference them from
  components.

```scss
// tokens.scss — define once
:root {
  --space-4: 1rem;
  --size-content-max: 40rem;
}

// App.scss — consume
.app {
  padding: var(--space-4);
  grid-template-columns: min(var(--size-full-percent), var(--size-content-max));
}
```

### BEM naming

Class names use **BEM** with **kebab-case** segments:

| Pattern | Example |
|---------|---------|
| Block | `session-list` |
| Element | `session-list__item` |
| Modifier | `session-list--compact` |
| Element + modifier | `session-list__item--active` |

In **TSX**, every `className` must be a **string literal** (so lint can verify
BEM). Each space-separated token must match BEM.

In **SCSS**, use the **`&` nesting syntax** for elements and modifiers—do not
write full nested class names without `&`. Pseudo-classes, pseudo-elements, and
attribute selectors on nested `&` are fine (e.g. `&:hover`, `&--nav:disabled`,
`&[aria-hidden="true"]`).

```scss
// Good
.session-list {
  padding: var(--space-4);

  &__item {
    &--active {
      font-weight: 600;
    }
  }

  &--compact {
    padding: var(--space-2);
  }
}

// Bad — rejected by ESLint
.session-list {
  .session-list__item { }
  .session-list--compact { }
}
```

Each component stylesheet (except under `src/styles/`) must have **exactly one
root** `.block` selector; all structure nests under it with `&__` / `&--`.

### Layout (mobile-first grid)

- **Mobile-first**: default styles target the narrow viewport; do not add
  breakpoint-based overrides.
- **CSS Grid only** for layout: every component root block uses `display: grid`
  plus an explicit **`grid-template-*`** (rows, columns, areas, or shorthand
  `grid-template`).
- **`src/styles/global.scss`**: `body` must be a grid with a template (page
  shell).
- **Forbidden** (enforced by ESLint): `display: flex` / `inline-flex`,
  `@media`, and `@container`.
- Prefer **`min()`**, **`clamp()`**, **`fr`**, and **`auto`** in templates to
  adapt width without queries—not min/max-width breakpoint patterns.

```scss
// Good — single mobile layout, grid template defines structure
.card-list {
  display: grid;
  grid-template-columns: min(var(--size-full-percent), var(--size-card-max));
  justify-content: center;
  gap: var(--space-3);

  &__item {
    display: grid;
    grid-template-rows: auto auto;
    gap: var(--space-2);
  }
}

// Bad
.card-list {
  display: flex;
  @media (min-width: 768px) { }
}
```

## ESLint

- Flat config: `eslint.config.js` imports blocks from the **`eslint/index.js`**
  barrel.
- Shared app rules: `eslint/app-typescript-block.js`.
- SCSS rules: `eslint/scss-block.js` (plain-text parser + PostCSS).
- **Custom rules** live in `eslint/rules/` and are registered on the
  `treadmill-tracker` plugin in `eslint/custom-rules.js`.

| Rule | Scope | Enforces |
|------|--------|----------|
| `treadmill-tracker/bem-class-name` | `*.{ts,tsx}` | BEM `className` literals |
| `treadmill-tracker/scss-style-import` | `*.{ts,tsx}` | `.scss` imports only |
| `treadmill-tracker/scss-bem` | `**/*.scss` except `src/styles/**` and `src/index.scss` | Root `.block` + `&` BEM nesting; pseudo-classes/elements and attribute selectors on nested `&` |
| `treadmill-tracker/scss-layout` | `**/*.scss` except `src/index.scss` | No flex / `@media` / `@container`; grid + template on component roots and `body` |
| `treadmill-tracker/scss-tokens` | Component `**/*.scss` (not `src/styles/**`) | No magic numbers/colors; use `var(--*)` tokens |
| `treadmill-tracker/playwright-test-id-locators` | `**/tests/**/*.ts` | No `locator()`; use `getByTestId` |

When adding a new convention, add or extend a rule under `eslint/rules/`, wire
it in `custom-rules.js`, and document it here.

## React

- Functional components, colocated `Component.scss` per feature/component.
- Keep diffs minimal; match existing patterns.

## TypeScript

- **Named types only:** do not use inline object types in type positions—no
  `{ ... }` in intersections, unions, generics, or `extends`. Extract a
  `export type Foo = { ... }` (or a local alias) and reference it by name,
  including when composing with `&` or `|`.
- **Narrow with the type itself:** do not use `"prop" in value` (or similar
  attribute probes) to discriminate unions. Prefer **`instanceof`** for class
  hierarchies, or an explicit discriminant field and equality checks when types
  stay plain data.
- **Meaningful names:** every binding must read clearly (`sessionState`, not
  `s`). Inline a one-off when a name would not help; keep a variable when it is
  reused or makes an **`instanceof`** guard easier to read.
- **Conditionals:** avoid multi-line ternaries and ternary-heavy control flow.
  Use **`if` / `else`** (or early `return`) for branches; reserve **`?:`** for
  genuine one-liners (single expression, fits on one line).
- **Typed control flow:** avoid **boolean parameters** that switch behavior.
  Prefer a **union of named types or classes** (often two variants plus a union
  alias) and narrow with **`instanceof`** or a discriminant.

## Workout domain

- **Types first:** `src/workout/models/` (`Workout`, `WorkoutSet`, session
  snapshot types).
- **Scalars (Zod):** schemas and inferred brands in
  `src/workout/models/types.ts` — `uuid5Schema`, `nonEmptyStrSchema`,
  `positiveIntSchema`, `positiveIntOrZeroSchema`, `positiveFloatSchema`,
  `speedKmhSchema` (non-negative
  speed; quantized to 0.1 km/h, **0** allowed everywhere including sets and
  session averages), `inclinePercentSchema` (`.brand()` + `z.infer<>`). Parse at
  model boundaries with **`.parse()`**. `Workout` / `WorkoutSet` **names** are
  **`NonEmptyStr`**; **`WorkoutSet.id`** is **`Uuid5`** (`uuid` v5 + fixed namespace
  in `workoutSet.ts` + name). **`Workout.id`** is **`WorkoutId`** (`workoutIdSchema`):
  stable identity, never re-derived from the name after creation. Catalog workouts
  and legacy saved records use **`workoutIdFromName`** (v5); new saved workouts use
  **`newWorkoutId()`** (v4). Saved workouts are matched by **`id`**, never by name
  (duplicate names are allowed); set fields use the other schemas
  (speed/incline rounded before parse in `WorkoutSet`). Session
  **`WorkoutSessionStatus`** — `WorkoutSessionStatus` `as const` literals +
  `workoutSessionStatusSchema` (`z.enum` of those values) in `workoutSession.ts`;
  type from `z.infer<typeof workoutSessionStatusSchema>`.
- **Building workouts:** use positional constructors —
  `new WorkoutSet(name, durationSeconds, speedKmh, inclinePercent)` and
  `new Workout(name, sets, id?)` (see `defaultWorkout.ts`; omit `id` only for
  catalog workouts).
- **Active workout:** **`workoutCatalog.ts`** defines **`WorkoutCatalogKeys`**
  (`as const` literal map), **`WorkoutCatalogKey`** (union type), **`WORKOUT_CATALOG`**
  (`Map<WorkoutCatalogKey, Workout>`), **`workoutCatalogKeyFromString`** (URL →
  key or `null`), and **`workoutFromCatalogKey`**. **`useActiveWorkout`** (in
  `src/workout/hooks/`) reads **`?workout=<key>`**; missing or unknown keys
  resolve to **`WorkoutCatalogKeys.Default`** and the URL is updated with
  **`history.replaceState`** so **`?workout=`** is always present. **`WorkoutRunner`**
  calls **`useActiveWorkout`**
  then **`useSessionStatistics(workout)`** and **`useWorkoutSession(workout, statisticsActions)`**.
- **Workout barrels:** `src/workout/index.js` re-exports models, catalog helpers,
  and id helpers for **`App`** (not **`WorkoutRunner`** — that stays on
  **`WorkoutRunner/index.js`** so Playwright `typecheck:e2e` never pulls TSX through
  the app barrel). `src/workout/models/index.js`,
  `src/workout/storage/index.js`, and
  `src/workout/data/index.js`, `src/workout/hooks/index.js`, and
  `src/workout/session/index.js` (React-free session controller and commit
  types) re-export their folders. Import hooks via the hooks barrel, not
  individual hook files.
 **`App`** routes via **`AppRoutes`**; the runner lives at **`/run`**. Workout
 selection uses **`useActiveWorkout`** (`?workout=` + catalog and
 **`localStorage`** saved workouts via **`WorkoutLibraryProvider`**).
 **`workoutLibrary.ts`** exposes **`workoutLibraryController`** (catalog/saved
 list entries, resolve by key, CRUD) backed by **`workoutStorageController`**.
 Planning CRUD is basic (name + ordered sets); editing a catalog workout saves a
 copy with a new id.
- **Workout storage:** `localStorage["treadmill-tracker-workouts"]` holds
 `{ version: 1, workouts: [{ id, name, sets }] }` (`storedWorkoutRecord.ts`). The
 pre-v1 bare array (records without `id`) still loads, with ids from
 **`workoutIdFromName`**. Records are parsed one by one; anything unreadable
 (bad record, invalid JSON, unknown `version`) is copied to
 `treadmill-tracker-workouts-unreadable` before the next save can drop it. Bump
 **`STORED_WORKOUTS_VERSION`** and keep reading older layouts when the shape changes.
- **Session UI:** **`WorkoutRunner`** calls exactly two hooks. The runner body
  listens for **ArrowLeft** / **ArrowRight** / **Space**, horizontal **swipes**,
  and **double-tap** via **`useWorkoutRunnerSessionControls`** (same rules as the
  footer prev / next / pause controls).
  **`useSessionStatistics(workout)`** is a thin React adapter for
  **`SessionStatisticsController`** (`src/workout/session/sessionStatisticsController.ts`):
  it owns **`sessionStatistics`** as **`SessionRunStatistics`** and exposes
  **`recordTransition`** / **`resetStatistics`**, mirroring **`useWorkoutSession`**'s
  shape. **`useWorkoutSession(workout, statisticsActions)`** is a thin React adapter for
  **`WorkoutSessionController`** (`src/workout/session/workoutSessionController.ts`;
  commit types in `src/workout/session/recordSessionTransitionInput.ts`):
  guards and domain transitions live on the controller (`*Commit()` →
  **`CommitSessionTransitionInput`**, including **`CommitNoSessionTransition`** for
  no-ops); the hook **`commit`** uses **`instanceof`** to skip no-ops, then
  calls **`recordTransition`** then **`setState`** in one turn (timer uses
  **`elapsedTickCommit()`**). The timer counts **wall-clock** seconds
  (`Date.now()`), not interval callbacks: it polls and on `visibilitychange`
  commits one tick per elapsed second, so throttled background tabs and locked
  screens catch up. It returns **`snapshot`** and session actions.
  **`WorkoutRunner`**
  passes **`sessionStatistics`** into **`WorkoutRunnerSessionProvider`**;
  **`useWorkoutRunnerSession()`**
  supplies the header and completion panel from the same aggregates.
- **Session statistics (actual run):** `src/workout/models/sessionStatistics.ts`
  holds **`SessionRunStatistics`** (**`forWorkout`**, **`secondsCompletedBySet`**,
  **`sessionElapsedSeconds`**, **`withElapsedSecond`**, immutable **`recordTransition`**), **`SecondsCompletedBySet`**, and
  **`SessionRunStatisticsDisplay`** (from **`SessionRunStatistics`** only—never
  **`Workout.completionStats()`**): **`sessionElapsedText`** for header and completion
  **Total time** (wall-clock; not reduced by “Previous”), **`workoutName`**, averages
  from timer seconds on the active set (`withElapsedSecond(setIndex)`). One rule covers every
  transition: sets from the prior index up to the destination are credited at
  full planned duration (so “Next” counts skipped sets fully), sets after the
  destination are dropped (so “Previous” forgets the abandoned branch), and the
  destination gets **`planned − remainingSeconds`**. **Total time** (header and
  completion) uses **`sessionElapsedText`**; completion averages use credited
  elapsed-weighted averages on **`SessionRunStatistics`** only (not credit-weighted).

## End-to-end tests (Playwright)

**Every new user-facing behavior needs a Playwright test in the same change.**
No backend; tests run against the Vite dev server (started by
`playwright.config.ts`).

### Layout (colocated)

Tests live **next to the feature** they cover:

```text
src/<feature>/
  …component source…
  tests/
    <Name>View.ts      # or <Name>Component.ts — view/component object (POM)
    <feature>.fixture.ts   # optional Playwright fixture for that feature only
    <feature>.spec.ts
```

Shared, cross-feature helpers only under `src/tests/` (e.g.
`support/ComponentHandle.ts`, `fixtures.ts` for `mergeTests`). Do **not**
centralize all selectors or flows in one script.

### View / Component objects (not “Page” objects)

- Name objects **`FooView`** or **`FooComponent`** depending on scope (screen vs
  widget).
- Each object owns **locators and actions for one BEM block** (or one UI
  widget)—construct with Playwright `Page`, expose `root`, navigation/open
  helpers, and `expectReady()`.
- Specs **compose** objects and fixtures; keep scenarios short and readable.
- Prefer a **local `*.fixture.ts`** per feature (`test.extend({ app: … })`).
  Combine fixtures with `mergeTests` when a spec needs multiple views—see
  comment in `src/tests/fixtures.ts`.
- **Locators:** use **`getByTestId` only**—never `locator('.class')`, `#id`, or
  other CSS selectors (enforced by ESLint).
- Add **`data-testid` string literals** on elements under test in TSX; use the
  same literal strings in View objects’ `getByTestId(...)`.
- Naming: kebab-case, feature prefix (`app-title`, `session-list-item`).

### Commands

- `mise run test:e2e` — headless (uses **system Google Chrome** via
  `PW_CHANNEL=chrome` in mise; `npm run test:e2e` uses bundled Chromium)
- `npm run typecheck:e2e` — `tsc -p tsconfig.playwright.json`
- Config: `playwright.config.ts`; tests match `src/**/tests/**/*.spec.ts`.
  E2E dev server runs on port **5183** (not 5173, so a running `mise run dev` is
  never reused) with `VITE_PWA_DEV=false` so missing `dev-dist/sw.js` does not
  block the Vite overlay during tests.
- PWA output (manifest, service worker) only exists in the production build:
  name those specs **`*.pwa.spec.ts`**; the `chromium-pwa` project runs them
  against `vite build && vite preview` on port **5184**.
- Timer behavior: use `page.clock` (`install()` before `goto`; `fastForward`
  simulates a suspended tab / locked screen).
