/**
 * Depth-First Search (DFS) Algorithm Implementation
 * 
 * This algorithm explores the grid by going as far as possible along each branch before backtracking.
 * It uses a stack (LIFO) for exploration, which can be implemented using recursion or an explicit stack.
 * 
 * DFS doesn't guarantee the shortest path but can be more memory efficient than BFS.
 */

/**
 * Implements the Depth-First Search algorithm to find a path
 * @param {number} gridSize - The size of the grid (gridSize x gridSize)
 * @param {Object} startPos - The starting position {row, col}
 * @param {Object} targetPos - The target position {row, col}
 * @param {Set} walls - Set of wall positions in "row-col" format
 * @param {Function} updateVisited - Callback to update UI with visited cells
 * @param {Function} updatePath - Callback to update UI with final path
 * @returns {Object} - Results including whether path was found, path, visited nodes count
 */
const depthFirstSearch = async (
  gridSize,
  startPos,
  targetPos,
  walls,
  updateVisited,
  updatePath
) => {
  // Data structures needed for DFS
  const stack = []; // Stack for DFS traversal (using array with push/pop for LIFO)
  const visited = new Set(); // Track visited cells
  const parent = new Map(); // Track the path to reconstruct later
  let pathFound = false;
  let visitedCount = 0;
  
  // Convert positions to string format for easy comparison
  const startPosStr = `${startPos.row}-${startPos.col}`;
  const targetPosStr = `${targetPos.row}-${targetPos.col}`;
  
  // Initialize DFS with the start position
  stack.push(startPosStr);
  
  // Define directions with priority: down (top priority), then right, left, and up last
  // This ensures DFS goes as far down as possible before backtracking
  const directions = [
    [1, 0],   // down (highest priority - will be processed first)
    [0, 1],   // right
    [0, -1],  // left
    [-1, 0]   // up (lowest priority - only when no other options)
  ];
  
  // We'll use this to track the order in which we process directions
  // We want to process down first, then right, then left, then up
  
  // Simulate async delay for visualization
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  // DFS main loop using explicit stack
  while (stack.length > 0) {
    const current = stack.pop(); // Pop the top cell from stack (LIFO)
    
    // Skip if already visited
    if (visited.has(current)) continue;
    
    const [currentRow, currentCol] = current.split('-').map(Number);
    visited.add(current);
    visitedCount++;
    
    // Check if we've reached the target
    if (current === targetPosStr) {
      pathFound = true;
      break;
    }
    
    // Update UI to show the current cell as visited
    if (updateVisited && current !== startPosStr) {
      updateVisited(currentRow, currentCol);
      // Reduced delay for faster visualization
      if (visitedCount % 3 === 0) { // Only delay every 3rd cell for better performance
        await delay(1);
      }
    }
    
    // Explore neighbors in order (top of stack will be processed next)
    // Since we want to prioritize down, we push in reverse order
    for (let i = directions.length - 1; i >= 0; i--) {
      const [dx, dy] = directions[i];
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
          stack.push(newPos);
          // Only set parent if not already set (first discovery)
          if (!parent.has(newPos)) {
            parent.set(newPos, current);
          }
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
 * Helper function to visualize DFS step by step
 * This is a simpler version that returns all the steps for visualization
 */
export const getDFSSteps = (gridSize, startPos, targetPos, walls) => {
  const steps = [];
  const stack = [];
  const visited = new Set();
  const parent = new Map();
  
  const startPosStr = `${startPos.row}-${startPos.col}`;
  const targetPosStr = `${targetPos.row}-${targetPos.col}`;
  
  stack.push(startPosStr);
  
  // Define directions with priority: down, right, left, up
  const directions = [
    [1, 0],   // down (highest priority)
    [0, 1],   // right
    [0, -1],  // left
    [-1, 0]   // up (lowest priority)
  ];
  let pathFound = false;
  
  while (stack.length > 0) {
    const current = stack.pop();
    
    if (visited.has(current)) continue;
    
    const [currentRow, currentCol] = current.split('-').map(Number);
    visited.add(current);
    steps.push({ type: 'visit', position: current });
    
    if (current === targetPosStr) {
      pathFound = true;
      break;
    }
    
    // Explore neighbors in order (top of stack will be processed next)
    // Since we want to prioritize down, we push in reverse order
    for (let i = directions.length - 1; i >= 0; i--) {
      const [dx, dy] = directions[i];
      const newRow = currentRow + dx;
      const newCol = currentCol + dy;
      
      if (
        newRow >= 0 && newRow < gridSize && 
        newCol >= 0 && newCol < gridSize
      ) {
        const newPos = `${newRow}-${newCol}`;
        
        if (!walls.has(newPos) && !visited.has(newPos)) {
          stack.push(newPos);
          if (!parent.has(newPos)) {
            parent.set(newPos, current);
          }
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

// Export as both named and default for compatibility
export { depthFirstSearch };
export default depthFirstSearch;
