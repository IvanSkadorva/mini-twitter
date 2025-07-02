import React from "react";

import type { Reply, Tweet } from "../types";

interface TweetProps {
  tweet: Tweet;
  liked: boolean;
  onLike: () => void;
  onReply: () => void;
  onDelete: () => void;
  replying: boolean;
  replyContent: string;
  onReplyContentChange: (value: string) => void;
  onReplySubmit: (e: React.FormEvent) => void;
  parseHashtags: (
    content: string,
    onClick: (tag: string) => void
  ) => React.ReactNode;
  maxChars: number;
  replySubmitting: boolean;
  children?: React.ReactNode;
}

const getAvatarColor = (username: string) => {
  // Simple hash for color
  const colors = [
    "bg-blue-400",
    "bg-pink-400",
    "bg-green-400",
    "bg-yellow-400",
    "bg-purple-400",
    "bg-red-400",
  ];
  let hash = 0;
  for (let i = 0; i < username.length; i++) hash += username.charCodeAt(i);
  return colors[hash % colors.length];
};

const TweetComponent: React.FC<TweetProps> = ({
  tweet,
  liked,
  onLike,
  onReply,
  onDelete,
  replying,
  replyContent,
  onReplyContentChange,
  onReplySubmit,
  parseHashtags,
  maxChars,
  replySubmitting,
  children,
}) => (
  <li className="border rounded p-4 bg-white shadow flex flex-col sm:flex-row gap-3">
    {/* Avatar */}
    <div className="flex-shrink-0 flex items-start">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow ${getAvatarColor(
          tweet.username
        )}`}
        aria-label={`Avatar for @${tweet.username}`}
      >
        {tweet.username[0].toUpperCase()}
      </div>
    </div>
    {/* Main content */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-base truncate">
          @{tweet.username}
        </span>
        <span className="text-xs text-gray-400 ml-1">
          {new Date(tweet.timestamp).toLocaleString()}
        </span>
      </div>
      <div className="mt-1 text-sm break-words">
        {parseHashtags(tweet.content, () => {})}
      </div>
      <div className="flex gap-4 text-xs text-gray-500 mt-2">
        <span aria-label="likes">❤️ {tweet.likes}</span>
        <span aria-label="replies">💬 {tweet.replies.length}</span>
      </div>
      <div className="flex gap-2 mt-3 flex-wrap">
        <button
          className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-pink-400 ${
            liked
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-pink-500 text-white hover:bg-pink-600"
          }`}
          onClick={onLike}
          disabled={liked}
          aria-pressed={liked}
        >
          {liked ? "Liked" : "Like"}
        </button>
        <button
          className="px-3 py-1 rounded text-sm font-medium bg-gray-200 hover:bg-gray-300 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={onReply}
        >
          Reply
        </button>
        <button
          className="px-3 py-1 rounded text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-400"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
      {replying && (
        <form onSubmit={onReplySubmit} className="mt-3 flex flex-col gap-2">
          <textarea
            className="border rounded p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={2}
            maxLength={maxChars}
            value={replyContent}
            onChange={(e) => onReplyContentChange(e.target.value)}
            placeholder="Write a reply..."
          />
          <div className="flex justify-between items-center text-xs">
            <span
              className={
                replyContent.length > maxChars
                  ? "text-red-500"
                  : "text-gray-500"
              }
            >
              {replyContent.length}/{maxChars}
            </span>
            <button
              type="submit"
              className="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50"
              disabled={
                !replyContent.trim() ||
                replyContent.length > maxChars ||
                replySubmitting
              }
            >
              Reply
            </button>
          </div>
        </form>
      )}
      {children}
    </div>
  </li>
);

export default TweetComponent;
