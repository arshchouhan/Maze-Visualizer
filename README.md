# Matrix Visualizer

A modern, interactive 2D matrix visualization built with React and Tailwind CSS. Features movable start and target nodes with a sleek, modern interface.

## Features

- **Interactive Grid**: 20x20 matrix with smooth hover effects
- **Movable Nodes**: Click buttons to move start (green) and target (amber) nodes
- **Wall Drawing**: Click and drag to create walls/obstacles
- **Modern UI**: Advanced Tailwind CSS styling with glowing effects and animations
- **Responsive Design**: Works on different screen sizes

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## How to Use

1. **Move Start Node**: Click the "Move Start" button, then click any empty cell
2. **Move Target Node**: Click the "Move Target" button, then click any empty cell  
3. **Draw Walls**: Click and drag on empty cells to create walls
4. **Clear Walls**: Remove all walls with the "Clear Walls" button
5. **Reset Grid**: Reset everything to default positions

## Technologies Used

- React 18
- Tailwind CSS 3
- Heroicons
- PostCSS & Autoprefixer

## File Structure

```
src/
├── components/
│   └── Matrix.js          # Main grid component
├── App.js                 # Main application component
├── index.js              # React entry point
└── index.css             # Tailwind CSS imports and custom styles
```
