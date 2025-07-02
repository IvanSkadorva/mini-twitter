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

  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mini Twitter Feed</h1>
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
          {tweets.map((tweet) => (
            <li key={tweet.id} className="border rounded p-4 bg-white shadow">
              <div className="font-semibold">@{tweet.username}</div>
              <div className="mt-2">{tweet.content}</div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(tweet.timestamp).toLocaleString()} | Likes:{" "}
                {tweet.likes} | Replies: {tweet.replies.length}
              </div>
              <button
                className={`mt-2 px-3 py-1 rounded text-sm font-medium ${
                  likedTweets.includes(tweet.id)
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-pink-500 text-white hover:bg-pink-600"
                }`}
                onClick={() => handleLike(tweet.id)}
                disabled={likedTweets.includes(tweet.id)}
              >
                {likedTweets.includes(tweet.id) ? "Liked" : "Like"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
