# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**nhis-connect** is a React Native (Expo) mobile app for NHIS membership renewal and appointment booking in Ghana. It targets both subscriber and administrator roles. Currently scaffolded — feature implementation has not yet started.

## Commands

```bash
# Install dependencies
bun install

# Start dev server (scan QR with Expo Go, or use simulator)
bunx expo start

# Platform-specific
bun run android
bun run ios
bun run web

# Lint and format
bun run lint       # eslint + prettier check
bun run format     # eslint --fix + prettier --write

# Validate Expo SDK package versions
bunx expo install --check

# EAS Build / OTA
eas build --platform all
eas update --environment preview
```

## Environment Setup

Create a `.env` file in the project root before starting:

```
EXPO_PUBLIC_SUPABASE_URL=your-supabase-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

The Supabase client (`config/supabase.ts`) throws at startup if these are missing.

## Architecture

### Navigation (Expo Router)

File-based routing under `app/`. Three route groups:

- `app/index.tsx` — entry point; checks auth state and redirects to `(dash)` or shows `(auth)/get-started`
- `app/(auth)/` — unauthenticated screens (get-started, login, register, etc.)
- `app/(dash)/(tabs)/` — main authenticated tab layout (home, profile, settings)

The root `_layout.tsx` wraps everything in `ThemeProvider`, loads Poppins fonts, and manages splash screen. The `(dash)` stack has `gestureEnabled: false` to prevent swiping back to auth.

Tabs are data-driven: add/modify tabs in `constants/tabs.ts`. Each entry has a `name` (matches the filename in `(tabs)/`), a `label`, and `icon` with `sf` (SF Symbols for iOS) and `md` (Material Symbols for Android). The tab layout uses `expo-router/unstable-native-tabs` for platform-native tab bars; a `.web.tsx` variant exists for web.

### State Management

- **Zustand** (`store/`) for client-only state: auth flags, UI preferences, ephemeral UI. Auth store persists `isAuthenticated` and `user` via `zustand/middleware/persist` backed by AsyncStorage.
- **TanStack Query (React Query)** for all server state (API data, cache, sync). Not yet installed — add it when feature implementation begins.
- Do not duplicate server data in Zustand. See `skills/react-native-expo-core.mdc` §1a for the Zustand/React Query boundary.

### Styling

- **NativeWind** (Tailwind utility classes) — `global.css` is imported in `app/_layout.tsx`
- **`StyleSheet`** for complex layouts or performance-critical code
- Colors exclusively from `constants/colors.ts` via `useTheme()`. Never hardcode color values.
- Theme system: `ThemeContext` resolves `light | dark | system` to a `ColorPalette` and exposes `colors`, `mode`, `resolved`, `setMode`.

### Backend

- **Supabase** for auth, PostgreSQL, and storage. The singleton client is at `config/supabase.ts`. Auth uses AsyncStorage session persistence (non-sensitive session data). For sensitive data (tokens, credentials), use `expo-secure-store`.
- All backend logic lives in `services/` — UI components never import `supabase` directly.
- API errors follow the structure in `skills/api-error-handling.mdc`. 4xx: show `error.message`; 5xx: show a generic message. Map `error.details` to form fields with `setError` from react-hook-form.

### Forms

Forms use **react-hook-form** + **zod**. Reusable schemas are in `lib/validation.ts` (email, password, OTP). Import from `zod/v3` (the project uses Zod v4's compatibility layer).

## Non-Obvious Rules

**Component usage — always:**
- Use `@/components/common/Text` instead of `Text` from `react-native`
- Use `expo-image` instead of `Image` from `react-native`
- Use `@/components/common/MainContainer` as the root wrapper for screens (provides SafeAreaView + ScrollView)

**Imports:**
- Always use the `@/` path alias (configured in `tsconfig.json` and `babel.config.js`)
- Import directly from source files, not barrel re-exports, to avoid pulling in unused code

**Services layer:**
- One concern per file; keep business logic in `services/`, not in screens or components
- Structure: `services/api/client.ts` (base HTTP client), `services/api/endpoints.ts` (constants), `services/<domain>.service.ts` (per-domain calls)

**Lists:**
- `< 20 items`: ScrollView is fine
- `20–100`: FlatList
- `> 100`: FlashList (`@shopify/flash-list`)

**File size:** Keep every file under 200 lines. Split into hooks, utils, or services if longer.

**Platform-specific code:** Use Expo platform extensions (`.ios.tsx`, `.android.tsx`, `.native.ts`) — Expo picks the right file at build time.

**No `console.log`** in committed code.
