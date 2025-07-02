import React from "react";

const TweetSkeleton: React.FC = () => (
  <li className="border rounded p-4 bg-white shadow flex flex-col sm:flex-row gap-3 animate-pulse">
    <div className="flex-shrink-0 flex items-start">
      <div className="w-10 h-10 rounded-full bg-gray-200" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-3 w-16 bg-gray-100 rounded ml-1" />
      </div>
      <div className="mt-2 h-4 w-full bg-gray-100 rounded" />
      <div className="mt-1 h-3 w-2/3 bg-gray-100 rounded" />
      <div className="flex gap-2 mt-3">
        <div className="h-7 w-16 bg-gray-200 rounded" />
        <div className="h-7 w-16 bg-gray-200 rounded" />
        <div className="h-7 w-16 bg-gray-200 rounded" />
      </div>
    </div>
  </li>
);

export default TweetSkeleton;
