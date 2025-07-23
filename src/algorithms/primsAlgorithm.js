/**
 * Proper Prim's Algorithm for Maze Generation with Animation
 * Fixed: Starts from top-left, correct wall/passage logic with color swapping
 */

// Helper function to add delay for animation
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generates a maze using Prim's algorithm with step-by-step animation
 * @param {number} gridSize - The size of the grid
 * @param {Function} updateWalls - Callback to update UI with current walls
 * @param {Function} updateMazeGeneration - Callback to update UI with maze generation cells
 * @param {number} animationSpeed - Speed of animation in milliseconds
 * @returns {Object} - Results including final walls set and generation stats
 */
export const generateMazeWithPrims = async (
  gridSize,
  updateWalls,
  updateMazeGeneration,
  animationSpeed = 150
) => {
  // Initialize: Start with empty grid, then add walls to create maze
  const walls = new Set();
  const visited = new Set();
  const frontierCells = [];
  const mazeGenerationCells = new Set();
  
  // Step 1: Start from top-left corner (1,1 to leave border space)
  const startRow = 1;
  const startCol = 1;
  const startCell = `${startRow}-${startCol}`;
  
  // Step 2: Mark starting cell as visited (this will remain a passage during generation)
  visited.add(startCell);
  mazeGenerationCells.add(startCell);
  
  // Step 3: Add neighboring cells to frontier
  const addNeighborsToFrontier = (row, col) => {
    const neighbors = [
      [row - 2, col], [row + 2, col], // Vertical neighbors (2 steps for proper maze)
      [row, col - 2], [row, col + 2]  // Horizontal neighbors (2 steps for proper maze)
    ];
    
    for (const [newRow, newCol] of neighbors) {
      if (newRow > 0 && newRow < gridSize - 1 && newCol > 0 && newCol < gridSize - 1) {
        const cellKey = `${newRow}-${newCol}`;
        if (!visited.has(cellKey) && !frontierCells.some(([r, c]) => r === newRow && c === newCol)) {
          frontierCells.push([newRow, newCol]);
        }
      }
    }
  };
  
  addNeighborsToFrontier(startRow, startCol);
  
  let generationSteps = 0;
  
  // Update initial state
  updateWalls(new Set(walls));
  updateMazeGeneration(new Set(mazeGenerationCells));
  await sleep(animationSpeed);

  // Main Prim's algorithm loop
  while (frontierCells.length > 0) {
    // Pick a random frontier cell
    const randomIndex = Math.floor(Math.random() * frontierCells.length);
    const [cellRow, cellCol] = frontierCells.splice(randomIndex, 1)[0];
    const cellKey = `${cellRow}-${cellCol}`;
    
    // Find visited neighbors of this frontier cell
    const visitedNeighbors = [];
    const neighborDirections = [
      [cellRow - 2, cellCol], [cellRow + 2, cellCol],
      [cellRow, cellCol - 2], [cellRow, cellCol + 2]
    ];
    
    for (const [nRow, nCol] of neighborDirections) {
      if (nRow >= 0 && nRow < gridSize && nCol >= 0 && nCol < gridSize) {
        if (visited.has(`${nRow}-${nCol}`)) {
          visitedNeighbors.push([nRow, nCol]);
        }
      }
    }
    
    // If this frontier cell has visited neighbors, connect it
    if (visitedNeighbors.length > 0) {
      // Mark this cell as visited (it becomes a passage during generation)
      visited.add(cellKey);
      mazeGenerationCells.add(cellKey);
      
      // Connect to a random visited neighbor by removing the wall between them
      const [neighborRow, neighborCol] = visitedNeighbors[Math.floor(Math.random() * visitedNeighbors.length)];
      const wallRow = (cellRow + neighborRow) / 2;
      const wallCol = (cellCol + neighborCol) / 2;
      const wallKey = `${wallRow}-${wallCol}`;
      
      // The wall between them should also be a passage during generation
      visited.add(wallKey);
      mazeGenerationCells.add(wallKey);
      
      // Add new frontier cells
      addNeighborsToFrontier(cellRow, cellCol);
      
      generationSteps++;
      
          // Batch updates for better performance
      if (generationSteps % 3 === 0) { // Only update every 3 steps
        updateWalls(new Set(walls));
        updateMazeGeneration(new Set(mazeGenerationCells));
        // Minimal delay to keep UI responsive
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }
  }
  
  // Step 4: Mark all unvisited cells as walls (these are the actual walls in the maze)
  // Note: We're not adding the visited cells to walls, as they should remain as paths
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const cellKey = `${row}-${col}`;
      if (!visited.has(cellKey)) {
        walls.add(cellKey);
      }
    }
  }
  
  // Final update with complete walls
  // The actual walls Set contains only the unvisited cells (real walls)
  // The visited cells remain as paths in the maze
  updateWalls(new Set(walls));
  
  // Clear maze generation cells immediately - this will trigger the color swap in the UI
  updateMazeGeneration(new Set(['generation_complete']));
  
  return {
    walls: new Set(walls),
    passages: new Set(), // Now the unvisited cells are passages
    generationSteps,
    visitedCells: visited.size
  };
};

export default generateMazeWithPrims;
