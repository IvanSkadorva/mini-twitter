import React from "react";
import type { Tweet, Reply } from "../types";
import TweetComponent from "./Tweet";

const getAvatarColor = (username: string) => {
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

interface TweetListProps {
  tweets: Tweet[];
  likedTweets: string[];
  replyingTo: string | null;
  replyContent: string;
  onLike: (id: string) => void;
  onReply: (id: string) => void;
  onDelete: (id: string) => void;
  onReplyContentChange: (value: string) => void;
  onReplySubmit: (e: React.FormEvent, id: string) => void;
  parseHashtags: (
    content: string,
    onClick: (tag: string) => void
  ) => React.ReactNode;
  maxChars: number;
  replySubmitting: boolean;
  handleHashtagClick: (tag: string) => void;
  animateNew?: boolean;
}

const ReplyItem: React.FC<{
  reply: Reply;
  parseHashtags: (
    content: string,
    onClick: (tag: string) => void
  ) => React.ReactNode;
  handleHashtagClick: (tag: string) => void;
  animateNew?: boolean;
}> = ({ reply, parseHashtags, handleHashtagClick, animateNew }) => (
  <li
    className={`flex gap-2 items-start bg-gray-50 rounded p-2 mb-2 ${
      animateNew ? "animate-fadein" : ""
    }`}
  >
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-base shadow ${getAvatarColor(
        reply.username
      )}`}
      aria-label={`Avatar for @${reply.username}`}
    >
      {reply.username[0].toUpperCase()}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-xs truncate">
          @{reply.username}
        </span>
        <span className="text-xs text-gray-400 ml-1">
          {new Date(reply.timestamp).toLocaleString()}
        </span>
      </div>
      <div className="text-xs mt-1 break-words">
        {parseHashtags(reply.content, handleHashtagClick)}
      </div>
      <div className="text-xs text-gray-400 mt-1">❤️ {reply.likes}</div>
    </div>
  </li>
);

const TweetList: React.FC<TweetListProps> = ({
  tweets,
  likedTweets,
  replyingTo,
  replyContent,
  onLike,
  onReply,
  onDelete,
  onReplyContentChange,
  onReplySubmit,
  parseHashtags,
  maxChars,
  replySubmitting,
  handleHashtagClick,
  animateNew,
}) => (
  <ul className="space-y-4">
    {tweets.map((tweet) => (
      <div key={tweet.id} className={animateNew ? "animate-fadein" : ""}>
        <TweetComponent
          tweet={tweet}
          liked={likedTweets.includes(tweet.id)}
          onLike={() => onLike(tweet.id)}
          onReply={() => onReply(tweet.id)}
          onDelete={() => onDelete(tweet.id)}
          replying={replyingTo === tweet.id}
          replyContent={replyContent}
          onReplyContentChange={onReplyContentChange}
          onReplySubmit={(e) => onReplySubmit(e, tweet.id)}
          parseHashtags={parseHashtags}
          maxChars={maxChars}
          replySubmitting={replySubmitting}
        >
          {tweet.replies.length > 0 && (
            <ul className="mt-4 pl-4 border-l-2 border-blue-100 bg-blue-50/40 rounded space-y-2">
              {tweet.replies.map((reply) => (
                <ReplyItem
                  key={reply.id}
                  reply={reply}
                  parseHashtags={parseHashtags}
                  handleHashtagClick={handleHashtagClick}
                  animateNew={animateNew}
                />
              ))}
            </ul>
          )}
        </TweetComponent>
      </div>
    ))}
  </ul>
);

export default TweetList;
