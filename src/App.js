import React, { useState, useCallback } from 'react';
import { 
  PlayIcon, 
  FlagIcon, 
  TrashIcon, 
  ArrowPathIcon, 
  PuzzlePieceIcon,
  CursorArrowRaysIcon,
  CubeIcon,
  ChartBarIcon,
  InformationCircleIcon,
  CogIcon,
  HandRaisedIcon,
  StopIcon
} from '@heroicons/react/24/solid';
import Matrix from './components/Matrix';

const GRID_SIZE = 20;

function App() {
  // State management
  const [startPos, setStartPos] = useState({ row: 2, col: 2 });
  const [targetPos, setTargetPos] = useState({ row: 17, col: 17 });
  const [walls, setWalls] = useState(new Set());
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(false); // Track if we're currently dragging a node
  const [dragMode, setDragMode] = useState(null); // 'start', 'target', or null
  const [algorithm, setAlgorithm] = useState('breadth-first');
  const [mazeGenAlgorithm, setMazeGenAlgorithm] = useState('custom');

  const handleCellClick = useCallback((row, col) => {
    if (dragMode === 'start') {
      setStartPos({ row, col });
      setDragMode(null);
    } else if (dragMode === 'target') {
      setTargetPos({ row, col });
      setDragMode(null);
    } else if (row === startPos.row && col === startPos.col) {
      // Clicked on start node
      return;
    } else if (row === targetPos.row && col === targetPos.col) {
      // Clicked on target node
      return;
    } else {
      // Toggle wall
      const key = `${row}-${col}`;
      setWalls(prev => {
        const newWalls = new Set(prev);
        if (newWalls.has(key)) {
          newWalls.delete(key);
        } else {
          newWalls.add(key);
        }
        return newWalls;
      });
    }
  }, [dragMode, startPos, targetPos]);

  const handleMouseDown = useCallback((row, col) => {
    // If we click on start node, initiate dragging for start node
    if (row === startPos.row && col === startPos.col) {
      setIsDragging(true);
      setDragMode('start');
      return;
    }
    
    // If we click on target node, initiate dragging for target node
    if (row === targetPos.row && col === targetPos.col) {
      setIsDragging(true);
      setDragMode('target');
      return;
    }
    
    // If we're not on a special node, proceed with wall drawing
    if (!dragMode) {
      setIsDrawing(true);
      
      // Toggle wall status
      const key = `${row}-${col}`;
      setWalls(prev => {
        const newWalls = new Set(prev);
        if (newWalls.has(key)) {
          newWalls.delete(key);
        } else {
          newWalls.add(key);
        }
        return newWalls;
      });
    }
  }, [startPos, targetPos, dragMode]);


  const handleMouseEnter = useCallback((row, col) => {
    // If we're dragging a node, update its position
    if (isDragging && dragMode === 'start') {
      // Don't allow placing the start node on walls or the target
      if (!walls.has(`${row}-${col}`) && (row !== targetPos.row || col !== targetPos.col)) {
        setStartPos({ row, col });
      }
      return;
    }
    
    if (isDragging && dragMode === 'target') {
      // Don't allow placing the target node on walls or the start
      if (!walls.has(`${row}-${col}`) && (row !== startPos.row || col !== startPos.col)) {
        setTargetPos({ row, col });
      }
      return;
    }
    
    // Handle wall drawing during mouse drag
    if (isDrawing && row !== startPos.row && col !== startPos.col && 
        row !== targetPos.row && col !== targetPos.col) {
      const key = `${row}-${col}`;
      setWalls(prev => {
        const newWalls = new Set(prev);
        newWalls.add(key);
        return newWalls;
      });
    }
  }, [isDrawing, startPos, targetPos, isDragging, dragMode, walls]);

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
    
    // End any dragging operations
    if (isDragging) {
      setIsDragging(false);
      setDragMode(null);
    }
  }, [isDragging]);

  const clearWalls = () => {
    setWalls(new Set());
  };

  const resetGrid = () => {
    setWalls(new Set());
    setStartPos({ row: 2, col: 2 });
    setTargetPos({ row: 17, col: 17 });
    setDragMode(null);
  };

  return (
    <div className="min-h-screen bg-[#111827] font-sans">
      {/* Header Bar */}
      <header className="bg-[#1F2937] shadow-lg border-b border-gray-800">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <CubeIcon className="h-7 w-7 text-emerald-500 mr-2" />
            <h1 className="text-xl font-bold text-white">Matrix Visualizer</h1>
          </div>
          <div className="hidden md:block">
            <p className="text-gray-300 text-sm">Interactive 2D matrix visualization</p>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="container mx-auto px-4 py-6">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:grid-rows-[1fr] lg:min-h-[calc(100vh-120px)]" style={{ height: 'calc(100vh - 120px)' }}>
          {/* Left Column - Controls */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Algorithm Settings Panel */}
              <section className="bg-[#1F2937] rounded-lg shadow-lg overflow-hidden">
                <div className="bg-[#374151] px-4 py-3 flex items-center">
                  <CogIcon className="w-5 h-5 text-purple-500 mr-2" />
                  <h2 className="text-white font-medium">Algorithm Settings</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">Maze solving algorithm</label>
                    <select 
                      value={algorithm}
                      onChange={(e) => setAlgorithm(e.target.value)}
                      className="w-full bg-[#374151] text-white py-2 px-3 rounded-md cursor-pointer border border-gray-600"
                    >
                      <option value="breadth-first">Breadth-First</option>
                      <option value="depth-first">Depth-First</option>
                      <option value="astar">A* Algorithm</option>
                      <option value="dijkstra">Dijkstra's Algorithm</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">Maze generation</label>
                    <select 
                      value={mazeGenAlgorithm}
                      onChange={(e) => setMazeGenAlgorithm(e.target.value)}
                      className="w-full bg-[#374151] text-white py-2 px-3 rounded-md cursor-pointer border border-gray-600"
                    >
                      <option value="custom">Custom</option>
                      <option value="random">Random</option>
                      <option value="recursive">Recursive Division</option>
                      <option value="prims">Prim's Algorithm</option>
                    </select>
                  </div>
                  
                  <button
                    onClick={() => {}} // Placeholder for future functionality
                    className="w-full mt-2 py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-all flex items-center justify-center"
                  >
                    <PlayIcon className="w-4 h-4 mr-2" />
                    Start Algorithm
                  </button>
                </div>
              </section>

              {/* Instructional Note for drag-and-drop */}
              <section className="bg-[#1F2937] rounded-lg shadow-lg overflow-hidden">
                <div className="bg-[#374151] px-4 py-3 flex items-center">
                  <HandRaisedIcon className="w-5 h-5 text-white mr-2" />
                  <h2 className="text-white font-medium">Interaction Guide</h2>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-gray-300">Start Node: Drag with cursor</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span className="text-gray-300">Target Node: Drag with cursor</span>
                  </div>
                  <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-md mt-2">
                    <p className="text-blue-400 text-xs">
                      💡 Click and drag the start and target nodes directly with your cursor. Use click or click-and-drag to draw walls.
                    </p>
                  </div>
                </div>
              </section>
              {/* Grid Controls Panel */}
              <section className="bg-[#1F2937] rounded-lg shadow-lg overflow-hidden">
                <div className="bg-[#374151] px-4 py-3 flex items-center">
                  <StopIcon className="w-5 h-5 text-blue-500 mr-2" />
                  <h2 className="text-white font-medium">Grid Controls</h2>
                </div>
                <div className="p-4 space-y-3">
                  <button
                    onClick={clearWalls}
                    className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-sm transition-all"
                  >
                    <StopIcon className="w-4 h-4 mr-2" />
                    Clear Walls
                  </button>

                  <button
                    onClick={resetGrid}
                    className="w-full flex items-center justify-center px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium text-sm transition-all"
                  >
                    <ArrowPathIcon className="w-4 h-4 mr-2" />
                    Reset Grid
                  </button>
                </div>
              </section>
            </div>
          </div>

          {/* Right Column - Matrix and Stats */}
          <div className="lg:col-span-3 space-y-6">
            {/* Matrix Container */}
            <section className="bg-[#1F2937] rounded-lg shadow-lg overflow-hidden flex flex-col">
              <div className="bg-[#374151] px-4 py-3 flex justify-between items-center">
                <div className="flex items-center">
                  <CubeIcon className="w-5 h-5 text-white mr-2" />
                  <h2 className="text-white font-medium">Grid Visualization</h2>
                </div>
                <div className="flex items-center space-x-3">
                  {/* Legend */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-emerald-500 rounded-sm mr-1"></div>
                      <span className="text-gray-300 text-xs">Start</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-amber-500 rounded-sm mr-1"></div>
                      <span className="text-gray-300 text-xs">Target</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gray-600 rounded-sm mr-1"></div>
                      <span className="text-gray-300 text-xs">Wall</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-2 flex flex-grow" style={{ height: 'calc(100vh - 200px)', minHeight: '600px' }}>
                <div className="w-full h-full">
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
                  />
                </div>
              </div>
            </section>

            {/* Statistics and Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Statistics Panel */}
              <section className="bg-[#1F2937] rounded-lg shadow-lg overflow-hidden">
                <div className="bg-[#374151] px-4 py-3 flex items-center">
                  <ChartBarIcon className="w-5 h-5 text-blue-500 mr-2" />
                  <h2 className="text-white font-medium">Statistics</h2>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#2C3648] rounded-md p-3">
                      <p className="text-xs text-gray-400">Grid Size</p>
                      <p className="text-base text-white font-mono">{GRID_SIZE} × {GRID_SIZE}</p>
                    </div>
                    <div className="bg-[#2C3648] rounded-md p-3">
                      <p className="text-xs text-gray-400">Total Cells</p>
                      <p className="text-base text-white font-mono">{GRID_SIZE * GRID_SIZE}</p>
                    </div>
                    <div className="bg-[#2C3648] rounded-md p-3">
                      <p className="text-xs text-gray-400">Walls</p>
                      <p className="text-base text-white font-mono">{walls.size}</p>
                    </div>
                    <div className="bg-[#2C3648] rounded-md p-3">
                      <p className="text-xs text-gray-400">Free Cells</p>
                      <p className="text-base text-white font-mono">{GRID_SIZE * GRID_SIZE - walls.size - 2}</p>
                    </div>
                    <div className="bg-[#2C3648] rounded-md p-3">
                      <p className="text-xs text-gray-400">Start Position</p>
                      <p className="text-base text-emerald-500 font-mono">({startPos.row}, {startPos.col})</p>
                    </div>
                    <div className="bg-[#2C3648] rounded-md p-3">
                      <p className="text-xs text-gray-400">Target Position</p>
                      <p className="text-base text-amber-500 font-mono">({targetPos.row}, {targetPos.col})</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Instructions Panel */}
              <section className="bg-[#1F2937] rounded-lg shadow-lg overflow-hidden">
                <div className="bg-[#374151] px-4 py-3 flex items-center">
                  <InformationCircleIcon className="w-5 h-5 text-sky-500 mr-2" />
                  <h2 className="text-white font-medium">Instructions</h2>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    <div className="bg-[#2C3648] rounded-md p-3">
                      <p className="text-white text-sm mb-1 font-medium">Drawing Walls</p>
                      <p className="text-gray-300 text-xs">Click and drag on empty cells to create walls/obstacles</p>
                    </div>
                    <div className="bg-[#2C3648] rounded-md p-3">
                      <p className="text-white text-sm mb-1 font-medium">Moving Start/Target</p>
                      <p className="text-gray-300 text-xs">Use the buttons in the Node Controls panel to move start and target positions</p>
                    </div>
                    <div className="bg-[#2C3648] rounded-md p-3">
                      <p className="text-white text-sm mb-1 font-medium">Running Algorithms</p>
                      <p className="text-gray-300 text-xs">Select an algorithm and click 'Start Algorithm' to visualize pathfinding</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
