/**
 * Dijkstra's Algorithm Implementation
 * 
 * Finds the shortest path between nodes in a graph with non-negative edge weights.
 * In this implementation, all edges have a weight of 1 (unweighted graph).
 */

/**
 * Implements Dijkstra's algorithm for pathfinding
 * @param {number} gridSize - The size of the grid (gridSize x gridSize)
 * @param {Object} startPos - The starting position {row, col}
 * @param {Object} targetPos - The target position {row, col}
 * @param {Set} walls - Set of wall positions in "row-col" format
 * @param {Function} updateVisited - Callback to update UI with visited cells
 * @param {Function} updatePath - Callback to update UI with final path
 * @returns {Object} - Results including whether path was found, path, visited nodes count
 */
const dijkstra = async (
  gridSize,
  startPos,
  targetPos,
  walls,
  updateVisited,
  updatePath
) => {
  const startTime = performance.now();
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

  // Directions: up, right, down, left
  const directions = [
    [-1, 0], // up
    [0, 1],  // right
    [1, 0],  // down
    [0, -1]  // left
  ];

  // For visualization delay
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Priority queue (min-heap) based on distance
  const priorityQueue = [];
  const distances = {};
  const previous = {};
  const visited = new Set();
  let visitedCount = 0;

  // Initialize distances
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const pos = `${row}-${col}`;
      distances[pos] = Infinity;
      previous[pos] = null;
    }
  }
  distances[startPosStr] = 0;
  priorityQueue.push({ pos: startPosStr, distance: 0 });

  // Helper function to get unvisited neighbors
  const getUnvisitedNeighbors = (currentPos) => {
    const [row, col] = currentPos.split('-').map(Number);
    const neighbors = [];

    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;
      
      if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
        const neighborPos = `${newRow}-${newCol}`;
        if (!walls.has(neighborPos) && !visited.has(neighborPos)) {
          neighbors.push({
            pos: neighborPos,
            row: newRow,
            col: newCol,
            distance: 1 // All edges have weight of 1 in an unweighted grid
          });
        }
      }
    }

    return neighbors;
  };

  // Main algorithm loop
  while (priorityQueue.length > 0) {
    // Sort the priority queue (simple implementation, could be optimized with a proper priority queue)
    priorityQueue.sort((a, b) => a.distance - b.distance);
    const { pos: currentPos, distance } = priorityQueue.shift();

    // Skip if we've already processed this node
    if (visited.has(currentPos)) continue;
    
    // Mark as visited
    visited.add(currentPos);
    visitedCount++;

    // Update UI for visited cell (except start position)
    if (currentPos !== startPosStr) {
      const [row, col] = currentPos.split('-').map(Number);
      if (updateVisited) {
        updateVisited(row, col);
        // Only delay every 3rd cell for better performance
        if (visitedCount % 3 === 0) {
          await delay(1);
        }
      }
    }

    // Check if we've reached the target
    if (currentPos === targetPosStr) {
      break;
    }

    // Explore neighbors
    const neighbors = getUnvisitedNeighbors(currentPos);
    for (const neighbor of neighbors) {
      const { pos: neighborPos, row, col, distance: edgeWeight } = neighbor;
      
      // Calculate new distance
      const newDistance = distances[currentPos] + edgeWeight;
      
      // If we found a shorter path to the neighbor
      if (newDistance < distances[neighborPos]) {
        distances[neighborPos] = newDistance;
        previous[neighborPos] = currentPos;
        priorityQueue.push({ pos: neighborPos, distance: newDistance });
      }
    }
  }

  // Reconstruct the path if target was found
  const path = [];
  let pathFound = distances[targetPosStr] !== Infinity;
  
  if (pathFound) {
    let current = targetPosStr;
    
    // Work backward from target to start
    while (current !== startPosStr) {
      const [row, col] = current.split('-').map(Number);
      path.unshift({ row, col });
      current = previous[current];
    }
    
    // Update UI with the final path
    if (updatePath) {
      for (const { row, col } of path) {
        updatePath(row, col);
        await delay(10); // Slightly longer delay for path visualization
      }
    }
  }

  const executionTime = performance.now() - startTime;
  
  return {
    pathFound,
    path,
    visitedCount,
    pathLength: path.length,
    success: pathFound,
    executionTime
  };
};

export default dijkstra;
