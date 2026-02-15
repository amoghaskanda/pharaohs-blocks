# Pharaoh's Blocks

An Egyptian-themed Tetris clone built with React, TypeScript, and Vite.

## Features

- **Egyptian Theme**: Custom styling, fonts, and atmosphere.
- **Game Logic**: Standard block stacking mechanics with level progression.
- **Controls**: Keyboard support for movement, rotation, and drops.

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run the development server**
   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

## Controls

- **Left / Right Arrows**: Move piece
- **Up Arrow**: Rotate piece
- **Down Arrow**: Soft drop
- **Space**: Hard drop (hold to speed up)
- **Pause**: Click the Pause button on screen

## Deployment

This repository includes a GitHub Actions workflow `.github/workflows/deploy.yml` that automatically deploys the `dist` folder to the `gh-pages` branch on every push to `main` or `master`.
