import React from 'react';

const BoxLoader = () => {
  return (
    <div className="relative overflow-hidden bg-slate-700 h-24 w-full rounded flex items-center space-x-4 p-4 my-1">
      {/* Shimmer Layer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-wave"></div>
      
      {/* Large square on the left */}
      <div className="bg-slate-500 h-12 w-12 rounded"></div>
      
      {/* Smaller squares (text lines) on the right */}
      <div className="flex-1 space-y-4 py-1">
        <div className="h-4 bg-slate-500 rounded w-3/4"></div>
        <div className="h-4 bg-slate-500 rounded w-5/6"></div>
        <div className="h-4 bg-slate-500 rounded w-2/3"></div>
      </div>
    </div>
  );
};

export default BoxLoader;

