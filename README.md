# Posecade

Play an arcade game by posing!

## About RCade

This game is built for [RCade](https://rcade.recurse.com), a custom arcade cabinet at The Recurse Center. Learn more about the project at [github.com/fcjr/RCade](https://github.com/fcjr/RCade).

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

This launches Vite on port 5173 and connects to the RCade cabinet emulator.

## Building

```bash
npm run build
```

Output goes to `dist/` and is ready for deployment.

## Project Structure

```
├── src/
│   ├── main.ts       # Game entry point
│   └── style.css     # Styles
├── index.html        # HTML entry
├── tsconfig.json     # TypeScript config
└── package.json
```

## Arcade Controls

This template uses `@rcade/plugin-input-classic` for arcade input:

```ts
import { PLAYER_1, SYSTEM } from '@rcade/plugin-input-classic'

// D-pad
if (PLAYER_1.DPAD.up) { /* ... */ }
if (PLAYER_1.DPAD.down) { /* ... */ }
if (PLAYER_1.DPAD.left) { /* ... */ }
if (PLAYER_1.DPAD.right) { /* ... */ }

// Buttons
if (PLAYER_1.A) { /* ... */ }
if (PLAYER_1.B) { /* ... */ }

// System
if (SYSTEM.ONE_PLAYER) { /* Start game */ }
```

## Deployment

First, create a new repository on GitHub:

1. Go to [github.com/new](https://github.com/new)
2. Create a new repository (can be public or private)
3. **Don't** initialize it with a README, .gitignore, or license

Then connect your local project and push:

```bash
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

The included GitHub Actions workflow will automatically deploy to RCade.

# Feature Roadmap

- UI needs to be snappier / on beat to feel like you can hit it perfectly
- Style
- Combos of PERFECT with multiplier
- Music tracks (public domain?)
- Beat detection for a music track
- Pause
- Countdown indicating how much time you have left

# Future Feature Ideas 
- MediaPipe integration to pose with camera
- Three.js integration to display 3d bodies
- Pose classification with Tensorflow so that people can train their own poses

---

Made with <3 at [The Recurse Center](https://recurse.com)
