"use client";

import React, { useEffect, useState } from "react";

interface Reply {
  id: string;
  username: string;
  content: string;
  timestamp: string;
  likes: number;
}

interface Tweet {
  id: string;
  username: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: Reply[];
}

function parseHashtags(content: string, onClick: (tag: string) => void) {
  const regex = /#(\w+)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(content.slice(lastIndex, match.index));
    }
    const tag = match[1];
    parts.push(
      <button
        key={match.index}
        className="text-blue-600 hover:underline inline"
        onClick={() => onClick(tag)}
        type="button"
      >
        #{tag}
      </button>
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }
  return parts;
}

export default function HomePage() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [tweetContent, setTweetContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [likedTweets, setLikedTweets] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("likedTweets") || "[]");
    }
    return [];
  });
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [activeHashtag, setActiveHashtag] = useState<string | null>(null);
  const maxChars = 280;

  useEffect(() => {
    fetch("http://localhost:3001/tweets")
      .then((res) => res.json())
      .then((data) => {
        setTweets(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("likedTweets", JSON.stringify(likedTweets));
    }
  }, [likedTweets]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tweetContent.trim() || tweetContent.length > maxChars) return;
    setSubmitting(true);
    const newTweet: Tweet = {
      id: Date.now().toString(),
      username: "demo_user",
      content: tweetContent,
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: [],
    };
    setTweets([newTweet, ...tweets]); // Optimistic UI
    setTweetContent("");
    try {
      await fetch("http://localhost:3001/tweets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTweet),
      });
    } catch (err) {
      // Optionally handle error, e.g., revert optimistic update
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (tweetId: string) => {
    if (likedTweets.includes(tweetId)) return;
    setLikedTweets([...likedTweets, tweetId]);
    setTweets((prev) =>
      prev.map((tweet) =>
        tweet.id === tweetId ? { ...tweet, likes: tweet.likes + 1 } : tweet
      )
    );
    try {
      const tweet = tweets.find((t) => t.id === tweetId);
      if (!tweet) return;
      await fetch(`http://localhost:3001/tweets/${tweetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: tweet.likes + 1 }),
      });
    } catch (err) {
      // Optionally handle error, e.g., revert optimistic update
    }
  };

  const handleReply = (tweetId: string) => {
    setReplyingTo(replyingTo === tweetId ? null : tweetId);
    setReplyContent("");
  };

  const handleReplySubmit = async (e: React.FormEvent, tweetId: string) => {
    e.preventDefault();
    if (!replyContent.trim() || replyContent.length > maxChars) return;
    setReplySubmitting(true);
    const newReply: Reply = {
      id: Date.now().toString(),
      username: "demo_user",
      content: replyContent,
      timestamp: new Date().toISOString(),
      likes: 0,
    };
    setTweets((prev) =>
      prev.map((tweet) =>
        tweet.id === tweetId
          ? { ...tweet, replies: [...tweet.replies, newReply] }
          : tweet
      )
    );
    setReplyContent("");
    setReplyingTo(null);
    try {
      const tweet = tweets.find((t) => t.id === tweetId);
      if (!tweet) return;
      await fetch(`http://localhost:3001/tweets/${tweetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replies: [...tweet.replies, newReply] }),
      });
    } catch (err) {
      // Optionally handle error, e.g., revert optimistic update
    } finally {
      setReplySubmitting(false);
    }
  };

  const handleDelete = async (tweetId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this tweet and its replies?"
    );
    if (!confirmed) return;
    setTweets((prev) => prev.filter((tweet) => tweet.id !== tweetId)); // Optimistic UI
    try {
      await fetch(`http://localhost:3001/tweets/${tweetId}`, {
        method: "DELETE",
      });
    } catch (err) {
      // Optionally handle error, e.g., revert optimistic update
    }
  };

  const handleHashtagClick = (tag: string) => {
    setActiveHashtag(tag);
  };

  const clearHashtagFilter = () => {
    setActiveHashtag(null);
  };

  const filteredTweets = activeHashtag
    ? tweets.filter((tweet) => tweet.content.includes(`#${activeHashtag}`))
    : tweets;

  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mini Twitter Feed</h1>
      {activeHashtag && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-blue-600 font-semibold">
            Filtering by #{activeHashtag}
          </span>
          <button
            className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-xs"
            onClick={clearHashtagFilter}
          >
            Clear filter
          </button>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="mb-6 bg-white p-4 rounded shadow flex flex-col gap-2"
      >
        <textarea
          className="border rounded p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={3}
          maxLength={maxChars}
          value={tweetContent}
          onChange={(e) => setTweetContent(e.target.value)}
          placeholder="What's happening?"
        />
        <div className="flex justify-between items-center text-sm">
          <span
            className={
              tweetContent.length > maxChars ? "text-red-500" : "text-gray-500"
            }
          >
            {tweetContent.length}/{maxChars}
          </span>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-1 rounded disabled:opacity-50"
            disabled={
              !tweetContent.trim() ||
              tweetContent.length > maxChars ||
              submitting
            }
          >
            Tweet
          </button>
        </div>
      </form>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul className="space-y-4">
          {filteredTweets.map((tweet) => (
            <li key={tweet.id} className="border rounded p-4 bg-white shadow">
              <div className="font-semibold">@{tweet.username}</div>
              <div className="mt-2">
                {parseHashtags(tweet.content, handleHashtagClick)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(tweet.timestamp).toLocaleString()} | Likes:{" "}
                {tweet.likes} | Replies: {tweet.replies.length}
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    likedTweets.includes(tweet.id)
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-pink-500 text-white hover:bg-pink-600"
                  }`}
                  onClick={() => handleLike(tweet.id)}
                  disabled={likedTweets.includes(tweet.id)}
                >
                  {likedTweets.includes(tweet.id) ? "Liked" : "Like"}
                </button>
                <button
                  className="px-3 py-1 rounded text-sm font-medium bg-gray-200 hover:bg-gray-300"
                  onClick={() => handleReply(tweet.id)}
                >
                  Reply
                </button>
                <button
                  className="px-3 py-1 rounded text-sm font-medium bg-red-500 text-white hover:bg-red-600"
                  onClick={() => handleDelete(tweet.id)}
                >
                  Delete
                </button>
              </div>
              {replyingTo === tweet.id && (
                <form
                  onSubmit={(e) => handleReplySubmit(e, tweet.id)}
                  className="mt-2 flex flex-col gap-2"
                >
                  <textarea
                    className="border rounded p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                    rows={2}
                    maxLength={maxChars}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
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
              {tweet.replies.length > 0 && (
                <ul className="mt-4 pl-4 border-l-2 border-gray-200 space-y-2">
                  {tweet.replies.map((reply) => (
                    <li key={reply.id} className="bg-gray-50 p-2 rounded">
                      <div className="font-semibold text-sm">
                        @{reply.username}
                      </div>
                      <div className="text-sm mt-1">
                        {parseHashtags(reply.content, handleHashtagClick)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(reply.timestamp).toLocaleString()} | Likes:{" "}
                        {reply.likes}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
