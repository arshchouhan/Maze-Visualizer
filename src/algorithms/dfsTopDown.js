/**
 * Depth-First Search (DFS) Algorithm Implementation with Top-Down Priority
 * 
 * This implementation ensures DFS explores downward first before other directions,
 * creating a more predictable top-down exploration pattern.
 */

/**
 * Implements the Depth-First Search algorithm with top-down priority
 * @param {number} gridSize - The size of the grid (gridSize x gridSize)
 * @param {Object} startPos - The starting position {row, col}
 * @param {Object} targetPos - The target position {row, col}
 * @param {Set} walls - Set of wall positions in "row-col" format
 * @param {Function} updateVisited - Callback to update UI with visited cells
 * @param {Function} updatePath - Callback to update UI with final path
 * @returns {Object} - Results including whether path was found, path, visited nodes count
 */
const depthFirstSearchTopDown = async (
  gridSize,
  startPos,
  targetPos,
  walls,
  updateVisited,
  updatePath
) => {
  const stack = [];
  const visited = new Set();
  const parent = new Map();
  let pathFound = false;
  let visitedCount = 0;
  
  const startPosStr = `${startPos.row}-${startPos.col}`;
  const targetPosStr = `${targetPos.row}-${targetPos.col}`;
  
  // Check if start is the same as target
  if (startPosStr === targetPosStr) {
    return {
      pathFound: true,
      path: [{ row: startPos.row, col: startPos.col }],
      visitedCount: 1,
      pathLength: 1,
      success: true,
      executionTime: 0
    };
  }
  
  // Initialize with start position
  stack.push(startPosStr);
  
  // Directions in order of priority: down, up, right, left
  // This ensures we always prioritize vertical movement (top-down)
  const directions = [
    [1, 0],   // down (highest priority)
    [-1, 0],  // up (second priority - still vertical)
    [0, 1],   // right
    [0, -1]   // left
  ];
  
  // For visualization delay
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  // Main DFS loop
  while (stack.length > 0) {
    const current = stack.pop();
    
    // Skip if already visited
    if (visited.has(current)) continue;
    
    const [currentRow, currentCol] = current.split('-').map(Number);
    visited.add(current);
    visitedCount++;
    
    // Check if target found
    if (current === targetPosStr) {
      pathFound = true;
      break;
    }
    
    // Update UI for visited cell
    if (updateVisited && current !== startPosStr) {
      updateVisited(currentRow, currentCol);
      // Only delay every 3rd cell for better performance
      if (visitedCount % 3 === 0) {
        await delay(1);
      }
    }
    
    // Process neighbors in reverse order (since we're using a stack)
    // This ensures vertical movement is always prioritized (down first, then up)
    // before horizontal movement (right, then left)
    for (let i = directions.length - 1; i >= 0; i--) {
      const [dx, dy] = directions[i];
      const newRow = currentRow + dx;
      const newCol = currentCol + dy;
      
      if (newRow >= 0 && newRow < gridSize && 
          newCol >= 0 && newCol < gridSize) {
        
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
  
  // Reconstruct the path if target was found
  const path = [];
  if (pathFound) {
    let current = targetPosStr;
    
    // Work backward from target to start
    while (current !== startPosStr) {
      const [row, col] = current.split('-').map(Number);
      path.unshift({ row, col });
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
  
  return {
    pathFound,
    path,
    visitedCount,
    pathLength: path.length,
    success: pathFound,
    executionTime: 0 // This will be calculated by the caller
  };
};

// Export both named and default for compatibility
export { depthFirstSearchTopDown };
export default depthFirstSearchTopDown;
