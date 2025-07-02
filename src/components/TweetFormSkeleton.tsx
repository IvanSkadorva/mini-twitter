import React from "react";

const TweetFormSkeleton: React.FC = () => (
  <div className="mb-6 bg-white p-4 rounded-xl shadow flex flex-col gap-2 border border-gray-100 animate-pulse">
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-full bg-gray-200" />
      <div className="flex-1">
        <div className="h-12 w-full bg-gray-100 rounded mb-2" />
      </div>
    </div>
    <div className="flex justify-between items-center text-sm mt-1">
      <div className="h-4 w-16 bg-gray-200 rounded" />
      <div className="h-8 w-20 bg-gray-200 rounded" />
    </div>
  </div>
);

export default TweetFormSkeleton;
