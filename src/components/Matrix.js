import React from 'react';
import { PlayIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

const Matrix = ({
  gridSize = 20,
  startPos,
  targetPos,
  walls,
  onCellClick,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  dragMode,
  visitedCells = new Set(),
  pathCells = new Set(),
  mazeGenerationCells = new Set(),
  isVisualizing = false
}) => {
  // Calculate cell type (empty, wall, start, or target)
  const getCellType = (row, col) => {
    if (row === startPos.row && col === startPos.col) return 'start';
    if (row === targetPos.row && col === targetPos.col) return 'target';
    if (walls.has(`${row}-${col}`)) return 'wall';
    return 'empty';
  };

  // Check if we're in maze generation mode or if generation just completed
  const isGenerating = mazeGenerationCells.has('generation_complete') ? false : mazeGenerationCells.size > 0;
  const generationComplete = mazeGenerationCells.has('generation_complete');
  
  // Get appropriate styles based on cell type
  const getCellStyle = (row, col) => {
    const type = getCellType(row, col);
    const cellKey = `${row}-${col}`;
    
    // During maze generation, show the generating path in solid black
    if (isGenerating && mazeGenerationCells.has(cellKey)) {
      return {
        backgroundColor: '#000000',
        width: '100%',
        height: '100%',
        aspectRatio: '1 / 1',
      };
    }
    
    // After generation, paths are gray, everything else is black
    let backgroundColor = '#e2e8f0'; // Default light gray (for paths during generation)
    let animation = '';
    
    // Handle cell coloring based on type and state
    if (pathCells.has(cellKey)) {
      // Path cells (blue with pulse animation)
      backgroundColor = '#3b82f6';
      animation = 'pulse 1s infinite';
    } else if (type === 'start') {
      // Start cell (green)
      backgroundColor = '#10b981';
    } else if (type === 'target') {
      // Target cell (amber)
      backgroundColor = '#f59e0b';
    } else if (type === 'wall') {
      // Wall cells (dark gray during generation, black after completion)
      backgroundColor = generationComplete ? '#000000' : '#4b5563';
    } else if (visitedCells.has(cellKey)) {
      // Visited cells (teal)
      backgroundColor = '#0d9488';
    } else if (pathCells.size > 0) {
      // After path is generated, use single color matching control panel
      backgroundColor = '#2d3748';
    } else {
      // Chessboard pattern matching control panel colors
      const isEven = (row + col) % 2 === 0;
      backgroundColor = isEven ? '#2d3748' : '#374151';
    }

    return {
      backgroundColor,
      animation,
      width: '100%',
      height: '100%',
      aspectRatio: '1 / 1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.1s ease',
      cursor: getCellType(row, col) === 'start' || getCellType(row, col) === 'target' 
        ? 'grab' 
        : dragMode === 'start' || dragMode === 'target' ? 'grabbing' 
        : 'pointer',
      transform: getCellType(row, col) === 'start' || getCellType(row, col) === 'target' 
        ? 'scale(1.05)' 
        : 'scale(1)'
    };
  };

  // Render cell content (icons for start and target)
  const renderCellContent = (row, col) => {
    const type = getCellType(row, col);
    
    if (type === 'start') {
      return (
        <PlayIcon style={{ width: '60%', height: '60%', color: 'white' }} />
      );
    } else if (type === 'target') {
      return (
        <CheckCircleIcon style={{ width: '60%', height: '60%', color: 'white' }} />
      );
    }
    
    return null;
  };

  // Create all cells for the grid
  const renderCells = () => {
    const cells = [];
    
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        cells.push(
          <div
            key={`${row}-${col}`}
            onClick={() => onCellClick(row, col)}
            onMouseDown={() => onMouseDown(row, col)}
            onMouseEnter={() => onMouseEnter(row, col)}
            onMouseUp={onMouseUp}
            onDragStart={(e) => e.preventDefault()}
            style={getCellStyle(row, col)}
          >
            {renderCellContent(row, col)}
          </div>
        );
      }
    }
    
    return cells;
  };

  // Render the matrix - padding is now handled by App.js grid container
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'grid',
      gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
      gridTemplateRows: `repeat(${gridSize}, 1fr)`,
      gap: '1px',
      backgroundColor: '#374151',
      border: '1px solid #374151'
    }}>
      {renderCells()}
    </div>
  );
};

export default Matrix;
