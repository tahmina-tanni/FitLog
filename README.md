# FitLog — Workout Library

FitLog is a responsive workout library built with Next.js. It helps users explore workouts, view exercise details, create a daily workout plan, and save their favorite exercises for later.

## Features

- Browse workouts from the FitLog REST API.
- Search workouts by name, equipment, or muscle group.
- Sort workouts by duration, calories, or rating.
- View individual workout details.
- Add up to five unique workouts to Today's Plan.
- Save workouts for later and remove saved items.
- Mark planned workouts as completed.
- View workout, duration, and calorie statistics.
- Store planned and saved workouts in browser localStorage.
- Responsive interface for mobile, tablet, and desktop.
- Loading, error, empty, and not-found states.

## Technologies Used

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Lucide React
- REST API
- Git and GitHub
- Vercel

## Getting Started

### Prerequisites

Make sure Node.js and npm are installed on your computer.

Check the installed versions:

```bash
node -v
npm -v
```

### Installation

1. Clone the repository:

```bash
git clone https://github.com/tahmina-tanni/FitLog.git
```

2. Open the project folder:

```bash
cd FitLog
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open the local URL shown in the terminal. If the app is running on port 3002, visit:

http://localhost:3002

## API Integration

FitLog retrieves workout data through its API integration.

- Primary API: `https://api.abcz.workers.dev/api/fitlog`
- Alternative API: `https://api.api-store.workers.dev/api/fitlog`

The application attempts to use the alternative endpoint if the primary endpoint fails. Workout plans and saved workouts are stored in the browser's localStorage.

## Project Structure

```text
app/
  api/
    workouts/
  components/
  my-plan/
  workout/
    [id]/
  globals.css
  layout.tsx
  page.tsx
  not-found.tsx

lib/
  api.ts
  store.tsx

public/
  assets/

types/
```

## Quality Checks

Run the following commands if the corresponding scripts are configured in `package.json`:

```bash
npm run lint
npm run typecheck
npm run build
```

## Live Demo

[Visit FitLog](https://fit-k3sd9871b-tahmina-tanni.vercel.app/)

## GitHub Repository

[View the FitLog source code](https://github.com/tahmina-tanni/FitLog)

## Author

**Tahmina Tanni**

Software Engineering Student
