/**
 * Breadth-First Search (BFS) Algorithm Implementation
 * 
 * This algorithm explores the grid layer by layer, starting from the start node
 * and expanding outward until it finds the target node or exhausts all possibilities.
 * 
 * BFS guarantees the shortest path in an unweighted graph.
 */

/**
 * Implements the Breadth-First Search algorithm to find the shortest path
 * @param {number} gridSize - The size of the grid (gridSize x gridSize)
 * @param {Object} startPos - The starting position {row, col}
 * @param {Object} targetPos - The target position {row, col}
 * @param {Set} walls - Set of wall positions in "row-col" format
 * @param {Function} updateVisited - Callback to update UI with visited cells
 * @param {Function} updatePath - Callback to update UI with final path
 * @returns {Object} - Results including whether path was found, path, visited nodes count
 */
export const breadthFirstSearch = async (
  gridSize,
  startPos,
  targetPos,
  walls,
  updateVisited,
  updatePath
) => {
  // Data structures needed for BFS
  const queue = []; // Queue for BFS traversal
  const visited = new Set(); // Track visited cells
  const parent = new Map(); // Track the path to reconstruct later
  let pathFound = false;
  let visitedCount = 0;
  
  // Convert positions to string format for easy comparison
  const startPosStr = `${startPos.row}-${startPos.col}`;
  const targetPosStr = `${targetPos.row}-${targetPos.col}`;
  
  // Initialize BFS with the start position
  queue.push(startPosStr);
  visited.add(startPosStr);
  
  // Define the four possible directions: up, right, down, left
  const directions = [
    [-1, 0],  // up
    [0, 1],   // right
    [1, 0],   // down
    [0, -1]   // left
  ];
  
  // Simulate async delay for visualization
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  // BFS main loop
  while (queue.length > 0) {
    const current = queue.shift(); // Dequeue the front cell
    const [currentRow, currentCol] = current.split('-').map(Number);
    visitedCount++;
    
    // Check if we've reached the target
    if (current === targetPosStr) {
      pathFound = true;
      break;
    }
    
    // Update UI to show the current cell as visited
    if (updateVisited && current !== startPosStr) {
      updateVisited(currentRow, currentCol);
      await delay(20); // Small delay for visualization
    }
    
    // Explore all four directions
    for (const [dx, dy] of directions) {
      const newRow = currentRow + dx;
      const newCol = currentCol + dy;
      
      // Check if the new position is valid
      if (
        newRow >= 0 && newRow < gridSize && 
        newCol >= 0 && newCol < gridSize
      ) {
        const newPos = `${newRow}-${newCol}`;
        
        // Check if the new position is not a wall and not visited yet
        if (!walls.has(newPos) && !visited.has(newPos)) {
          queue.push(newPos);
          visited.add(newPos);
          parent.set(newPos, current); // Track the parent for path reconstruction
        }
      }
    }
  }
  
  // Reconstruct the path if target was found
  const path = [];
  if (pathFound) {
    let current = targetPosStr;
    
    // Work backward from target to start
    while (current !== startPosStr) {
      const [row, col] = current.split('-').map(Number);
      path.unshift({ row, col }); // Add to the beginning of the path array
      current = parent.get(current);
    }
    
    // Update UI with the final path
    if (updatePath) {
      for (const { row, col } of path) {
        updatePath(row, col);
        await delay(50); // Slightly longer delay for path visualization
      }
    }
  }
  
  // Return the results
  return {
    pathFound,
    path,
    visitedCount,
    pathLength: path.length
  };
};

/**
 * Helper function to visualize BFS step by step
 * This is a simpler version that returns all the steps for visualization
 */
export const getBFSSteps = (gridSize, startPos, targetPos, walls) => {
  const steps = [];
  const queue = [];
  const visited = new Set();
  const parent = new Map();
  
  const startPosStr = `${startPos.row}-${startPos.col}`;
  const targetPosStr = `${targetPos.row}-${targetPos.col}`;
  
  queue.push(startPosStr);
  visited.add(startPosStr);
  steps.push({ type: 'visit', position: startPosStr });
  
  const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
  let pathFound = false;
  
  while (queue.length > 0) {
    const current = queue.shift();
    
    if (current === targetPosStr) {
      pathFound = true;
      break;
    }
    
    const [currentRow, currentCol] = current.split('-').map(Number);
    
    for (const [dx, dy] of directions) {
      const newRow = currentRow + dx;
      const newCol = currentCol + dy;
      
      if (
        newRow >= 0 && newRow < gridSize && 
        newCol >= 0 && newCol < gridSize
      ) {
        const newPos = `${newRow}-${newCol}`;
        
        if (!walls.has(newPos) && !visited.has(newPos)) {
          queue.push(newPos);
          visited.add(newPos);
          parent.set(newPos, current);
          steps.push({ type: 'visit', position: newPos });
        }
      }
    }
  }
  
  // Reconstruct path if found
  if (pathFound) {
    const path = [];
    let current = targetPosStr;
    
    while (current !== startPosStr) {
      path.unshift(current);
      steps.push({ type: 'path', position: current });
      current = parent.get(current);
    }
  }
  
  return {
    steps,
    pathFound,
    visitedCount: visited.size - 1 // Don't count start node
  };
};

export default breadthFirstSearch;
