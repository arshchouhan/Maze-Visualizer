import React, { useState, useCallback } from 'react';
import { breadthFirstSearch } from './algorithms/breadthFirstSearch';
import depthFirstSearch from './algorithms/dfsTopDown';
import dijkstra from './algorithms/dijkstra';
import { generateMazeWithPrims } from './algorithms/primsAlgorithm';
import { generateMazeWithRecursiveDivision } from './algorithms/recursiveDivision';
import Matrix from './components/Matrix';

const GRID_SIZE = 45;

function App() {
  // State management
  const [startPos, setStartPos] = useState({ row: 1, col: 1 });
  const [targetPos, setTargetPos] = useState({ row: 15, col: 25 });
  const [walls, setWalls] = useState(new Set());
  const [visitedCells, setVisitedCells] = useState(new Set());
  const [pathCells, setPathCells] = useState(new Set());
  const [mazeGenerationCells, setMazeGenerationCells] = useState(new Set());
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [isGeneratingMaze, setIsGeneratingMaze] = useState(false);
  const [algorithm, setAlgorithm] = useState('dijkstra');
  const [mazeGenAlgorithm, setMazeGenAlgorithm] = useState('prims');
  const [dragMode, setDragMode] = useState(null);

  // Cell click handler
  const handleCellClick = useCallback((row, col) => {
    if (isVisualizing || isGeneratingMaze) return;

    const cellKey = `${row}-${col}`;
    
    // Don't allow clicking on start or target positions
    if ((row === startPos.row && col === startPos.col) || 
        (row === targetPos.row && col === targetPos.col)) {
      return;
    }

    // Toggle wall
    setWalls(prev => {
      const newWalls = new Set(prev);
      if (newWalls.has(cellKey)) {
        newWalls.delete(cellKey);
      } else {
        newWalls.add(cellKey);
      }
      return newWalls;
    });
  }, [isVisualizing, isGeneratingMaze, startPos, targetPos]);

  // Mouse handlers for dragging
  const handleMouseDown = useCallback((row, col) => {
    if (isVisualizing || isGeneratingMaze) return;

    if (row === startPos.row && col === startPos.col) {
      setDragMode('start');
    } else if (row === targetPos.row && col === targetPos.col) {
      setDragMode('target');
    }
  }, [isVisualizing, isGeneratingMaze, startPos, targetPos]);

  const handleMouseEnter = useCallback((row, col) => {
    if (!dragMode || isVisualizing || isGeneratingMaze) return;

    const cellKey = `${row}-${col}`;
    
    // Remove wall if we're dragging over one
    setWalls(prev => {
      if (prev.has(cellKey)) {
        const newWalls = new Set(prev);
        newWalls.delete(cellKey);
        return newWalls;
      }
      return prev;
    });

    if (dragMode === 'start') {
      setStartPos({ row, col });
    } else if (dragMode === 'target') {
      setTargetPos({ row, col });
    }
  }, [dragMode, isVisualizing, isGeneratingMaze]);

  const handleMouseUp = useCallback(() => {
    setDragMode(null);
  }, []);

  // Clear walls
  const clearWalls = useCallback(() => {
    if (isVisualizing || isGeneratingMaze) return;
    setWalls(new Set());
    setVisitedCells(new Set());
    setPathCells(new Set());
    setMazeGenerationCells(new Set());
  }, [isVisualizing, isGeneratingMaze]);

  // Generate maze
  const generateMaze = useCallback(async () => {
    if (isVisualizing || isGeneratingMaze) return;

    setIsGeneratingMaze(true);
    setWalls(new Set());
    setVisitedCells(new Set());
    setPathCells(new Set());
    setMazeGenerationCells(new Set());

    try {
      const updateWalls = (newWalls) => setWalls(newWalls);
      const updateMazeGeneration = (newCells) => setMazeGenerationCells(newCells);

      let results;
      if (mazeGenAlgorithm === 'prims') {
        results = await generateMazeWithPrims(
          GRID_SIZE,
          updateWalls,
          updateMazeGeneration,
          150
        );
      } else if (mazeGenAlgorithm === 'recursive') {
        results = await generateMazeWithRecursiveDivision(
          GRID_SIZE,
          updateWalls,
          updateMazeGeneration,
          120
        );
      }


    } catch (error) {
      console.error('Error generating maze:', error);
    } finally {
      setIsGeneratingMaze(false);
    }
  }, [isVisualizing, isGeneratingMaze, mazeGenAlgorithm]);

  // Run algorithm
  const runAlgorithm = useCallback(async () => {
    if (isVisualizing || isGeneratingMaze) return;

    console.log('Starting algorithm:', algorithm); // Debug log
    
    setIsVisualizing(true);
    setVisitedCells(new Set());
    setPathCells(new Set());

    try {
      const updateVisited = (row, col) => {
        setVisitedCells(prev => new Set([...prev, `${row}-${col}`]));
      };

      const updatePath = (row, col) => {
        setPathCells(prev => new Set([...prev, `${row}-${col}`]));
      };

      let results;
      if (algorithm === 'breadth-first') {
        console.log('Executing BFS...'); // Debug log
        results = await breadthFirstSearch(
          GRID_SIZE,
          startPos,
          targetPos,
          walls,
          updateVisited,
          updatePath
        );
      } else if (algorithm === 'depth-first') {
        console.log('Executing DFS...'); // Debug log
        results = await depthFirstSearch(
          GRID_SIZE,
          startPos,
          targetPos,
          walls,
          updateVisited,
          updatePath
        );
      } else if (algorithm === 'dijkstra') {
        console.log('Executing Dijkstra\'s Algorithm...');
        results = await dijkstra(
          GRID_SIZE,
          startPos,
          targetPos,
          walls,
          updateVisited,
          updatePath
        );
      } else {
        console.error('Unknown algorithm selected:', algorithm);
      }


    } catch (error) {
      console.error('Error running algorithm:', error);
    } finally {
      setIsVisualizing(false);
    }
  }, [isVisualizing, isGeneratingMaze, startPos, targetPos, walls, algorithm]);

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div style={{
        width: '300px',
        backgroundColor: '#2d3748',
        color: 'white',
        padding: '24px',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Header */}
        <div style={{
          borderBottom: '2px solid #4a5568',
          paddingBottom: '16px'
        }}>
          <h2 style={{ 
            margin: 0, 
            fontSize: '20px', 
            fontWeight: 'bold',
            color: '#e2e8f0',
            textAlign: 'center'
          }}>Control Panel</h2>
        </div>
        
        {/* Algorithm Selection Section */}
        <div style={{
          backgroundColor: '#374151',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #4a5568'
        }}>
          <h3 style={{
            margin: '0 0 12px 0',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#f7fafc'
          }}>Pathfinding Algorithm</h3>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '2px solid #4a5568',
              fontSize: '14px',
              backgroundColor: '#1a202c',
              color: 'white',
              outline: 'none',
              cursor: 'pointer',
              marginBottom: '12px'
            }}
          >
            <option value="breadth-first">Breadth-First Search</option>
            <option value="depth-first">Depth-First Search (Top-Down)</option>
            <option value="dijkstra">Dijkstra's Algorithm</option>
          </select>
          
          <button
            onClick={runAlgorithm}
            disabled={isVisualizing || isGeneratingMaze}
            style={{
              width: '100%',
              padding: '10px 16px',
              backgroundColor: isVisualizing || isGeneratingMaze ? '#4a5568' : '#38a169',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: isVisualizing || isGeneratingMaze ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'all 0.2s ease',
              boxShadow: isVisualizing || isGeneratingMaze ? 'none' : '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            {isVisualizing ? '⏳ Running...' : '▶️ Start Pathfinding'}
          </button>
        </div>

        {/* Maze Generation Section */}
        <div style={{
          backgroundColor: '#374151',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #4a5568'
        }}>
          <h3 style={{
            margin: '0 0 12px 0',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#f7fafc'
          }}>Maze Generation</h3>
          <select
            value={mazeGenAlgorithm}
            onChange={(e) => setMazeGenAlgorithm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '2px solid #4a5568',
              fontSize: '14px',
              backgroundColor: '#1a202c',
              color: 'white',
              outline: 'none',
              cursor: 'pointer',
              marginBottom: '12px'
            }}
          >
            <option value="prims">Prim's Algorithm</option>
            <option value="recursive">Recursive Division</option>
          </select>
          
          <button
            onClick={generateMaze}
            disabled={isGeneratingMaze || isVisualizing}
            style={{
              width: '100%',
              padding: '10px 16px',
              backgroundColor: isGeneratingMaze || isVisualizing ? '#4a5568' : '#805ad5',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: isGeneratingMaze || isVisualizing ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'all 0.2s ease',
              boxShadow: isGeneratingMaze || isVisualizing ? 'none' : '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            {isGeneratingMaze ? 'Generating...' : 'Generate Maze'}
          </button>
        </div>

        {/* Control Buttons Section */}
        <div style={{
          backgroundColor: '#374151',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #4a5568'
        }}>
          <h3 style={{
            margin: '0 0 12px 0',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#f7fafc'
          }}>Controls</h3>
          
          <button
            onClick={clearWalls}
            disabled={isVisualizing || isGeneratingMaze}
            style={{
              width: '100%',
              padding: '10px 16px',
              backgroundColor: isVisualizing || isGeneratingMaze ? '#4a5568' : '#e53e3e',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: isVisualizing || isGeneratingMaze ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'all 0.2s ease',
              boxShadow: isVisualizing || isGeneratingMaze ? 'none' : '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            🗑️ Clear Grid
          </button>
        </div>
      </div>

      {/* Grid Container */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: '#f7fafc',
        overflow: 'hidden',
        padding: '4px',
        paddingBottom: '24px'
      }}>
        <div style={{
          width: '100%',
        }}>
          <Matrix
            gridSize={GRID_SIZE}
            startPos={startPos}
            targetPos={targetPos}
            walls={walls}
            onCellClick={handleCellClick}
            onMouseDown={handleMouseDown}
            onMouseEnter={handleMouseEnter}
            onMouseUp={handleMouseUp}
            dragMode={dragMode}
            visitedCells={visitedCells}
            pathCells={pathCells}
            mazeGenerationCells={mazeGenerationCells}
            isVisualizing={isVisualizing}
          />
        </div>
      </div>


    </div>
  );
}

export default App;