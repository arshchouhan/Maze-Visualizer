/**
 * Recursive Division Algorithm for Maze Generation
 * 
 * This algorithm generates a maze by starting with an empty space and 
 * recursively dividing it with walls, leaving passages through each wall.
 * 
 * Data Structures Used:
 * - Set: For tracking walls and division cells
 * - Array: For managing division operations and animation steps
 * - Recursive function calls: For the division process
 */

/**
 * Generates a maze using Recursive Division algorithm with systematic grid-like animation
 * @param {number} gridSize - The size of the grid (gridSize x gridSize)
 * @param {Function} updateWalls - Callback to update UI with current walls
 * @param {Function} updateMazeGeneration - Callback to update UI with maze generation cells
 * @param {number} animationSpeed - Speed of animation in milliseconds
 * @returns {Object} - Results including final walls set and generation stats
 */
export const generateMazeWithRecursiveDivision = async (
  gridSize,
  updateWalls,
  updateMazeGeneration,
  animationSpeed = 120
) => {
  const walls = new Set();
  const mazeGenerationCells = new Set();
  let generationSteps = 0;
  
  // Initialize: Start with border walls only
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      // Only create border walls initially
      if (row === 0 || row === gridSize - 1 || col === 0 || col === gridSize - 1) {
        walls.add(`${row}-${col}`);
      }
    }
  }
  
  // Update initial state (empty interior with border walls)
  updateWalls(new Set(walls));
  updateMazeGeneration(new Set());
  await sleep(animationSpeed);
  
  // Start classic recursive division on the entire interior space
  await recursiveDivide(
    1, 1, // top-left of interior
    gridSize - 2, gridSize - 2, // width and height of interior
    true, // start with horizontal division
    walls,
    mazeGenerationCells,
    updateWalls,
    updateMazeGeneration,
    animationSpeed,
    () => { generationSteps++; }
  );
  
  // Clear maze generation cells after completion
  setTimeout(() => {
    updateMazeGeneration(new Set());
  }, 1500);
  
  return {
    walls: new Set(walls),
    generationSteps,
    visitedCells: gridSize * gridSize - walls.size
  };
};

/**
 * Classic Recursive Division Algorithm
 * Recursively divides areas with alternating horizontal and vertical walls
 * @param {number} x - Left boundary of the area
 * @param {number} y - Top boundary of the area
 * @param {number} width - Width of the area
 * @param {number} height - Height of the area
 * @param {boolean} horizontal - Whether to divide horizontally (true) or vertically (false)
 * @param {Set} walls - Current walls set
 * @param {Set} mazeGenerationCells - Cells being processed
 * @param {Function} updateWalls - Callback to update walls
 * @param {Function} updateMazeGeneration - Callback to update generation cells
 * @param {number} animationSpeed - Animation delay
 * @param {Function} incrementSteps - Callback to increment step counter
 */
async function recursiveDivide(
  x, y, width, height, horizontal,
  walls, mazeGenerationCells,
  updateWalls, updateMazeGeneration,
  animationSpeed, incrementSteps
) {
  // Base case: area too small to divide
  if (width < 2 || height < 2) {
    return;
  }
  
  if (horizontal) {
    // Divide horizontally
    if (height < 3) return; // Need at least 3 cells to divide horizontally
    
    // Choose a random row to place the wall (avoid edges)
    const wallY = y + 1 + Math.floor(Math.random() * (height - 2));
    
    // Choose a random position for the passage
    const passageX = x + Math.floor(Math.random() * width);
    
    // Create horizontal wall with passage
    await createHorizontalWall(
      x, wallY, width, passageX,
      walls, mazeGenerationCells,
      updateWalls, updateMazeGeneration,
      animationSpeed, incrementSteps
    );
    
    // Recursively divide the two new areas (switch to vertical)
    await recursiveDivide(
      x, y, width, wallY - y, false, // top area, switch to vertical
      walls, mazeGenerationCells,
      updateWalls, updateMazeGeneration,
      animationSpeed, incrementSteps
    );
    
    await recursiveDivide(
      x, wallY + 1, width, height - (wallY - y + 1), false, // bottom area, switch to vertical
      walls, mazeGenerationCells,
      updateWalls, updateMazeGeneration,
      animationSpeed, incrementSteps
    );
    
  } else {
    // Divide vertically
    if (width < 3) return; // Need at least 3 cells to divide vertically
    
    // Choose a random column to place the wall (avoid edges)
    const wallX = x + 1 + Math.floor(Math.random() * (width - 2));
    
    // Choose a random position for the passage
    const passageY = y + Math.floor(Math.random() * height);
    
    // Create vertical wall with passage
    await createVerticalWall(
      wallX, y, height, passageY,
      walls, mazeGenerationCells,
      updateWalls, updateMazeGeneration,
      animationSpeed, incrementSteps
    );
    
    // Recursively divide the two new areas (switch to horizontal)
    await recursiveDivide(
      x, y, wallX - x, height, true, // left area, switch to horizontal
      walls, mazeGenerationCells,
      updateWalls, updateMazeGeneration,
      animationSpeed, incrementSteps
    );
    
    await recursiveDivide(
      wallX + 1, y, width - (wallX - x + 1), height, true, // right area, switch to horizontal
      walls, mazeGenerationCells,
      updateWalls, updateMazeGeneration,
      animationSpeed, incrementSteps
    );
  }
}

/**
 * Create a vertical wall with a passage
 */
async function createVerticalWall(
  wallCol, startRow, height, passageRow,
  walls, mazeGenerationCells,
  updateWalls, updateMazeGeneration,
  animationSpeed, incrementSteps
) {
  // Add vertical wall with passage
  const newWallCells = [];
  for (let row = startRow; row < startRow + height; row++) {
    if (row !== passageRow) {
      const cellKey = `${row}-${wallCol}`;
      walls.add(cellKey);
      mazeGenerationCells.add(cellKey);
      newWallCells.push(cellKey);
    }
  }
  
  // Animate the wall creation
  incrementSteps();
  updateWalls(new Set(walls));
  updateMazeGeneration(new Set(mazeGenerationCells));
  await sleep(animationSpeed);
  
  // Remove the wall cells from generation display after a short delay
  setTimeout(() => {
    newWallCells.forEach(cell => mazeGenerationCells.delete(cell));
    updateMazeGeneration(new Set(mazeGenerationCells));
  }, animationSpeed * 2);
}

/**
 * Create a horizontal wall with a passage
 */
async function createHorizontalWall(
  startCol, wallRow, width, passageCol,
  walls, mazeGenerationCells,
  updateWalls, updateMazeGeneration,
  animationSpeed, incrementSteps
) {
  // Add horizontal wall with passage
  const newWallCells = [];
  for (let col = startCol; col < startCol + width; col++) {
    if (col !== passageCol) {
      const cellKey = `${wallRow}-${col}`;
      walls.add(cellKey);
      mazeGenerationCells.add(cellKey);
      newWallCells.push(cellKey);
    }
  }
  
  // Animate the wall creation
  incrementSteps();
  updateWalls(new Set(walls));
  updateMazeGeneration(new Set(mazeGenerationCells));
  await sleep(animationSpeed);
  
  // Remove the wall cells from generation display after a short delay
  setTimeout(() => {
    newWallCells.forEach(cell => mazeGenerationCells.delete(cell));
    updateMazeGeneration(new Set(mazeGenerationCells));
  }, animationSpeed * 2);
}



/**
 * Sleep function for animation delays
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate maze steps for step-by-step visualization (simplified version)
 */
export const getRecursiveDivisionSteps = (gridSize) => {
  const steps = [];
  const walls = new Set();
  
  // Initialize with border walls
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (row === 0 || row === gridSize - 1 || col === 0 || col === gridSize - 1) {
        walls.add(`${row}-${col}`);
      }
    }
  }
  
  steps.push({
    walls: new Set(walls),
    action: 'start',
    description: 'Starting with border walls only'
  });
  
  // This would contain the recursive division steps
  // For now, return the initial step
  return steps;
};

export default generateMazeWithRecursiveDivision;
