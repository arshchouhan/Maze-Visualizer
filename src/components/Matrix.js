import React from 'react';
import { PlayIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

const Matrix = ({
  gridSize = 20, // Default value if not provided
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
  isVisualizing = false
}) => {
  // Calculate cell type (empty, wall, start, or target)
  const getCellType = (row, col) => {
    if (row === startPos.row && col === startPos.col) return 'start';
    if (row === targetPos.row && col === targetPos.col) return 'target';
    if (walls.has(`${row}-${col}`)) return 'wall';
    return 'empty';
  };

  // Get appropriate CSS class based on cell type
  const getCellClass = (row, col) => {
    const type = getCellType(row, col);
    const cellKey = `${row}-${col}`;
    let className = 'relative w-full h-full';

    if (type === 'start') {
      className += ' bg-emerald-500 shadow-emerald-500/50 shadow-inner';
    } else if (type === 'target') {
      className += ' bg-amber-500 shadow-amber-500/50 shadow-inner';
    } else if (type === 'wall') {
      className += ' bg-gray-600 shadow-gray-600/50 shadow-inner';
    } else if (pathCells.has(cellKey)) {
      // Path cells get a bright blue color with pulsing animation
      className += ' bg-blue-500 shadow-blue-500/50 shadow-inner animate-pulse';
    } else if (visitedCells.has(cellKey)) {
      // Visited cells get a teal color with bubble animation
      className += ' bg-teal-600 shadow-teal-600/50 shadow-inner';
      // Add specific animation class for bubble effect
      className += ' animate-bubble';
    } else {
      // Alternating colors for empty cells (chessboard pattern)
      const isEven = (row + col) % 2 === 0;
      className += isEven ? ' bg-[#2C3648]' : ' bg-[#1F2937]';
    }

    return className;
  };

  // Render the content of a cell (icons for start/target nodes)
  const renderCellContent = (row, col) => {
    const type = getCellType(row, col);
    if (type === 'start') {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <PlayIcon className="w-4 h-4 text-white drop-shadow-lg" />
        </div>
      );
    }
    if (type === 'target') {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-2 w-2 bg-white rounded-full"></div>
        </div>
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
            className={`${getCellClass(row, col)} ${dragMode && getCellType(row, col) === 'empty' ? 'hover:bg-blue-500/20' : ''}`}
            onClick={() => onCellClick(row, col)}
            onMouseDown={() => onMouseDown(row, col)}
            onMouseEnter={() => onMouseEnter(row, col)}
            onMouseUp={onMouseUp}
            onDragStart={(e) => e.preventDefault()}
            style={{
              cursor: getCellType(row, col) === 'start' || getCellType(row, col) === 'target' 
                ? 'grab' 
                : dragMode === 'start' || dragMode === 'target' ? 'grabbing' 
                : 'pointer',
              transition: 'all 0.1s ease',
              transform: getCellType(row, col) === 'start' || getCellType(row, col) === 'target' 
                ? 'scale(1.05)' 
                : 'scale(1)'
            }}
          >
            {renderCellContent(row, col)}
          </div>
        );
      }
    }
    
    return cells;
  };

  // Render the matrix
  return (
    <div 
      className="grid gap-[1px] bg-gray-700 p-[1px] rounded-md overflow-hidden shadow-lg w-full h-full"
      style={{ 
        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
        aspectRatio: '1/1',
        width: '100%',
        height: '100%',
        maxHeight: '100%'
      }}
    >
      {renderCells()}
    </div>
  );
};

export default Matrix;
