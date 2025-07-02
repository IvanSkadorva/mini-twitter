import React from "react";
import { FeedView } from "../types";

interface FeedHeaderProps {
  feedView: FeedView;
  setFeedView: (view: FeedView) => void;
  activeHashtag: string | null;
  clearHashtagFilter: () => void;
}

const FeedHeader: React.FC<FeedHeaderProps> = ({
  feedView,
  setFeedView,
  activeHashtag,
  clearHashtagFilter,
}) => (
  <div className="flex flex-col gap-2 mb-4">
    <div className="flex gap-2">
      <button
        className={`px-3 py-1 rounded font-medium text-sm border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
          feedView === FeedView.Latest
            ? "bg-blue-500 text-white border-blue-500"
            : "bg-white text-blue-500 border-blue-500 hover:bg-blue-50"
        }`}
        onClick={() => setFeedView(FeedView.Latest)}
        aria-pressed={feedView === FeedView.Latest}
      >
        Latest
      </button>
      <button
        className={`px-3 py-1 rounded font-medium text-sm border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
          feedView === FeedView.ForYou
            ? "bg-blue-500 text-white border-blue-500"
            : "bg-white text-blue-500 border-blue-500 hover:bg-blue-50"
        }`}
        onClick={() => setFeedView(FeedView.ForYou)}
        aria-pressed={feedView === FeedView.ForYou}
      >
        For You
      </button>
    </div>
    {activeHashtag && (
      <div className="flex items-center gap-2 mt-1">
        <span className="text-blue-600 font-semibold">
          Filtering by #{activeHashtag}
        </span>
        <button
          className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={clearHashtagFilter}
        >
          Clear filter
        </button>
      </div>
    )}
  </div>
);

export default FeedHeader;
