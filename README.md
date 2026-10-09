# FitLog — Workout Library

FitLog is a dark, responsive workout library built with Next.js. Browse exercises, inspect workout instructions, build a daily plan of up to five workouts, and save movements to revisit later.

## Features

- Live workout library backed by the FitLog API, with a fallback API endpoint.
- Responsive workout cards and individual workout detail pages.
- Search by workout name, equipment, or muscle group.
- Sort workouts by duration, calories, or rating.
- Add up to five unique workouts to Today's Plan.
- Save workouts for later and remove saved items.
- Mark planned workouts as done, with toast feedback.
- Live exercise, duration, calorie, Plan, and Saved counts.
- Browser `localStorage` persistence across reloads.
- Loading, empty, error, missing-image, and 404 states.
- Responsive layout for mobile, tablet, laptop, and desktop.

## Technology

- Next.js App Router 15
- React 19
- TypeScript (strict mode)
- Tailwind CSS configuration plus project-specific responsive CSS
- Lucide React icons
- FitLog REST API
- Git and GitHub
- Vercel deployment

## Requirements

- Node.js 20 LTS or another version supported by the installed Next.js release
- npm
- Internet access for dependency installation and the workout API

Check your versions:

```bash
node -v
npm -v
```

## Install and run locally

Open this folder in Visual Studio Code. In **Terminal → New Terminal**, make sure the terminal is inside the project root (the folder containing `package.json`), then run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To stop the development server, focus the terminal and press `Ctrl+C`.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
npm run start
```

`npm run start` is used after a successful production build. Stop it with `Ctrl+C`.

## API

Primary endpoint:

`https://api.abcz.workers.dev/api/fitlog`

Alternative endpoint:

`https://api.api-store.workers.dev/api/fitlog`

The app normalizes API fields into the `Workout` TypeScript type. It tries the alternative endpoint if the primary endpoint fails. Workout data is loaded from the API; the plan and saved lists are stored locally in the current browser.

## Project structure

```text
app/
  components/       Navbar, footer, workout cards, home library
  my-plan/          Today's Plan and Saved page
  workout/[id]/     Dynamic workout detail page
  globals.css       Responsive visual design
  layout.tsx        Root layout and shared providers
  not-found.tsx     Custom 404 page
lib/
  api.ts            API integration and response normalization
  store.tsx         Plan, saved, done, toast, and localStorage state
public/assets/      Original logo and hero banner
 types/             Shared TypeScript data types
```

## GitHub and meaningful commits

If the folder is not already a Git repository, initialize it from the project root:

```bash
git init
git branch -M main
```

Create an **empty** GitHub repository. Add its URL (replace the placeholders with your own values):

```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
```

Check `git status` and `git remote -v` before proceeding. Do not replace an existing remote or force-push over work you need.

To make at least eight **genuine, meaningful commits**, stage the listed groups one at a time. Do not run `git add .` before these grouped commits, because that would include all files in the first commit. These commands assume the files are not already committed; if some are already tracked, inspect `git status` and adapt the groups to the actual changes.

```bash
# 1. Project configuration
git add package.json next.config.ts tsconfig.json tailwind.config.ts postcss.config.mjs eslint.config.mjs
git commit -m "chore: configure Next.js TypeScript and styling"

# 2. Global layout and responsive styling
git add app/layout.tsx app/globals.css
git commit -m "feat: add FitLog design system and global layout"

# 3. Navigation and footer
git add app/components/Navbar.tsx app/components/Footer.tsx
git commit -m "feat: build responsive navbar and footer"

# 4. Workout cards and home library
git add app/page.tsx app/components/HomeClient.tsx app/components/WorkoutCard.tsx types/workout.ts
git commit -m "feat: build searchable and sortable workout library"

# 5. Server-side API proxy and client helper
git add app/api/workouts lib/api.ts
git commit -m "feat: integrate primary and fallback workout APIs"

# 6. Workout detail experience
git add 'app/workout/[id]/page.tsx'
git commit -m "feat: add workout details and plan actions"

# 7. Plan state and saved workouts
git add lib/store.tsx app/my-plan/page.tsx
git commit -m "feat: persist plan and saved workouts with localStorage"

# 8. 404 and documentation
git add app/not-found.tsx README.md .gitignore
git commit -m "docs: document setup and deployment requirements"

# 9. Push the commits
git push -u origin main
```

If Git says a group has no changes, do not create an empty commit. Check `git status` and `git log --oneline`; only count commits that contain real changes. The API detail route is inside the `app/api/workouts` folder and is included in commit 5.

## Deploy to Vercel

1. Push the project to your GitHub repository.
2. Sign in to Vercel using GitHub.
3. Select **Add New → Project** and import the FitLog repository.
4. Set the project root to the folder containing `package.json`.
5. Use the Next.js preset and the default build command (`npm run build`).
6. No environment variables are required by the current implementation.
7. Select **Deploy** and wait for the platform to report a successful deployment.
8. Open the real production URL and test the home page, a workout detail route, `/my-plan`, and refresh each route directly.
9. Test plan persistence and the API from the deployed site. The app uses same-origin Next.js API routes as a server-side proxy, which avoids browser-side CORS restrictions. If the API is unavailable to the deployment server, inspect the deployment function logs and confirm the provider endpoints are reachable.

## Submission

- Live Link: _add the actual Vercel URL after successful deployment_
- GitHub Repository: _add the actual repository URL_

## Troubleshooting

- **`node` or `npm` not recognized:** install Node.js LTS from [nodejs.org](https://nodejs.org/), restart VS Code, and check the versions again.
- **Dependency installation fails:** check your internet connection and rerun `npm install` from the project root.
- **API cannot load:** check the internet connection, API availability, and browser console/network errors. The application attempts the alternative endpoint, but external outages cannot be fixed by frontend code alone.
- **Build errors:** run `npm run typecheck` and `npm run lint`, fix the first reported source error, and retry `npm run build`.
- **Images fail:** check whether the API image URL is valid and whether the remote image host is reachable.

## Verification status

The source has been reviewed and assembled in the project workspace. A successful npm installation, lint, TypeScript check, browser test, and production build must be confirmed on a machine with dependency/network access before describing those checks as passed. Deployment and GitHub URLs should only be filled in after the actual actions succeed.
