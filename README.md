# Pholi

A creative portfolio platform where artists, musicians, photographers, and filmmakers can upload their work and arrange it into a personal, gallery-style page called a **pholi**.

Pholi is a full-stack web app built with Vue 3, TypeScript, and Supabase. I started it in Fall 2025 as a self-directed learning project to get hands-on with Vue, a relational backend, authentication, and drag-and-drop interfaces. It is a work in progress, and the Supabase backend is currently paused, so there is no live demo.

## Features

**Portfolio editor**

-   Drag-and-drop editor on a 16x9 grid. Place image, audio, video, and text blocks, and add filler blocks for spacing.
-   Resize any block by dragging its corner handle.
-   Staging area that separates uploaded media that has been placed on the grid from media that hasn't.
-   Layouts are saved to the database as a JSON matrix and rendered the same way on the public profile.

**Media**

-   Upload images, audio, and video with a 50 MB per-file limit, client-side validation, and optional cover images.
-   Audio and video playback through Plyr, with media preloaded before it is displayed.
-   Add a title, description, and date to each item, and delete media you no longer want.

**Accounts and profiles**

-   Sign up, log in, forgot password, and update password flows using Supabase Auth.
-   Route guards protect account pages from unauthenticated visitors.
-   Public profile pages at `/users/:username` that anyone can view without an account.
-   Editable display name, bio, and avatar.
-   Look up another user by exact username.

**Social**

-   Follow and unfollow other users, with follower and following counts on each profile.
-   Posts feed on each profile, separate from the portfolio grid.

## Tech stack

**Framework**

Vue 3 (Composition API, `<script setup>`), TypeScript

**Build**

Vite, `vue-tsc` for type checking

**Styling**

Tailwind CSS 4, shadcn-vue components (reka-ui, class-variance-authority), lucide icons

**State and routing**

Pinia, Vue Router

**Backend**

Supabase (Auth, Postgres, Storage, Row Level Security)

**Media**

Plyr / vue-plyr

**Deployment**

GitHub Actions to GitHub Pages

## Getting started

### Prerequisites

-   Node.js 22 (the version used in CI)
-   A Supabase project

### Setup

```bash
git clone https://github.com/camwharff/pholi.git
cd pholi
npm install

```

Create a `.env` file in the project root with your Supabase credentials:

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key

```

Then start the dev server:

```bash
npm run dev

```

### Scripts

Command

Description

`npm run dev`

Start the Vite dev server

`npm run build`

Type-check with `vue-tsc` and build for production

`npm run preview`

Preview the production build locally

`npm run debug`

Start Vite with HMR debug logging

### Supabase configuration

The project needs the following:

-   **`profiles` table**, keyed by the auth user's id, with `username`, `full_name`, `bio`, `avatar_src`, `media`, `posts`, `pholi`, and `updated_at`. The `media`, `posts`, and `pholi` columns hold JSON. The sign-up flow passes `username` and `full_name` as user metadata, so a profile row is created for each new user.
-   **`follows` table** with `follower_id` and `following_id`, both referencing profiles.
-   **Storage buckets** named `media` and `avatars`, both publicly readable.
-   **Row Level Security** enabled on the tables, with policies that let users modify only their own rows while keeping profiles and media publicly readable.

## Project structure

```
src/
  pages/         Route-level views: Home, Account, Profile, Swatches (design test page)
  components/
    blocks/      Feature components, grouped by context (self/, others/, shared/, admin/)
    media/       Image, audio, and video display and player components
    forms/       Login, sign-up, and password reset forms
    ui/          shadcn-vue component library
  lib/           Supabase client and handlers for auth, media, posts, follows, and grid logic
  stores/        Pinia stores for the current user and cached profiles
  router.ts      Routes and auth guards

```

### How the portfolio grid works

A pholi is stored as a `GridMatrix`, a 16x9 matrix of cells. Each cell is one of:

-   a **content cell** (media, text, or filler) that records its width, height, and source
-   a **block cell** that marks space occupied by a larger content cell
-   a **size cell** that marks the resize handle at a block's bottom-right corner

Resizing recomputes which cells a block occupies, and dropping a block onto the grid updates the matrix. The logic lives in `src/lib/pholiHelpers.ts`.

## Status and known limitations

Pholi is a learning project and the code reflects that:

-   The Supabase project is paused, so the app can't run against a backend until one is set up or the current one is unpaused.
-   The `dep/` folder holds deprecated components kept for reference.
-   User search is exact-match on username.
-   The database schema and policies are not yet in version control.

## Author

Built by [Camille Wharff](https://github.com/camwharff).
