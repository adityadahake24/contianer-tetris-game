# Container Tetris 🟩

> Stack Docker containers, Redis caches, Kafka brokers, Postgres databases and more into the perfect server rack. A DevOps-themed Tetris game — free to play, right in your browser.

---

## What is Container Tetris?

Container Tetris is a browser-based twist on the classic Tetris formula, designed for engineers and tech enthusiasts. Instead of geometric shapes, you're dropping **real DevOps containers** — each piece represents a familiar technology from the modern infrastructure stack.

| Piece | Container        | Color  |
|-------|-----------------|--------|
| I     | nginx           | Cyan   |
| O     | PostgreSQL      | Blue   |
| T     | Redis           | Red    |
| S     | Kafka           | Green  |
| Z     | RabbitMQ        | Orange |
| L     | Docker          | Teal   |
| J     | Prometheus      | Pink   |

The goal is the same as Tetris — clear lines, survive longer, beat the leaderboard. The DevOps flavour makes it a great conversation starter.

---

## How to Play

### Keyboard Controls

| Key          | Action       |
|-------------|--------------|
| `← →`       | Move left / right |
| `↑`         | Rotate clockwise  |
| `↓`         | Soft drop         |
| `Space`     | Hard drop (instant) |
| `C`         | Hold piece        |
| `P`         | Pause / Resume    |

### Mobile Controls

On-screen touch buttons are displayed below the board on mobile devices. The layout adapts automatically to any screen size — no scrolling required.

---

## Scoring

| Action              | Points                        |
|--------------------|-------------------------------|
| 1 line cleared     | 100 × level                   |
| 2 lines at once    | 300 × level                   |
| 3 lines at once    | 500 × level                   |
| 4 lines (Tetris!)  | 800 × level                   |

Level increases every 10 lines cleared. The pieces fall faster as your level rises.

---

## Features

- **7 DevOps-themed Tetrominoes** — each mapped to a real container technology
- **Ghost piece** — shows where the piece will land
- **Hold queue** — save a piece for later
- **Next piece preview** — see the upcoming 3 containers
- **Global leaderboard** — submit your score and compete
- **Pause / Resume** — take a break without losing your progress
- **Fully responsive** — desktop keyboard play and mobile touch controls
- **Terminal aesthetic** — dark background, green phosphor glow, monospace font

---

## Running Locally

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play.

---

## Environment Variables

Create a `.env` file in the project root:

```
DATABASE_URL=your_postgres_connection_string
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX   # optional
```

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Game Engine**: react-tetris (core logic)
- **Icons**: react-icons
- **Database**: PostgreSQL (leaderboard persistence)

---

## License

MIT — play, fork, and hack freely.
