import React from 'react';
import { XMarkIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

const StatisticsModal = ({ isOpen, onClose, stats, algorithmType }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1F2937] rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="bg-[#374151] px-6 py-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-white font-semibold text-lg">Algorithm Results</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="text-center mb-6">
            {stats.pathFound ? (
              <div className="flex items-center justify-center text-green-500 mb-2">
                <CheckCircleIcon className="w-8 h-8 mr-2" />
                <span className="text-lg font-semibold">Path Found!</span>
              </div>
            ) : (
              <div className="flex items-center justify-center text-red-500 mb-2">
                <XCircleIcon className="w-8 h-8 mr-2" />
                <span className="text-lg font-semibold">No Path Found</span>
              </div>
            )}
            <p className="text-gray-300 text-sm">Algorithm: {algorithmType}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[#2C3648] rounded-md p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">Cells Visited</p>
              <p className="text-2xl text-teal-500 font-mono font-bold">{stats.visitedCount}</p>
            </div>
            <div className="bg-[#2C3648] rounded-md p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">Path Length</p>
              <p className="text-2xl text-blue-500 font-mono font-bold">{stats.pathLength}</p>
            </div>
          </div>

          {stats.pathFound && (
            <div className="bg-green-900/20 border border-green-500/30 rounded-md p-3 mb-6">
              <p className="text-green-400 text-sm text-center">
                ✨ Successfully found the shortest path from start to target!
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                // Reset visualization if needed
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
            >
              Run Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsModal;
