"use client";

import React, { useEffect, useState, useRef } from "react";

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

function extractHashtags(content: string): string[] {
  return (content.match(/#(\w+)/g) || []).map((tag) => tag.slice(1));
}

import TweetForm from "../components/TweetForm";
import TweetList from "../components/TweetList";
import FeedHeader from "../components/FeedHeader";

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
  const [feedView, setFeedView] = useState<"latest" | "foryou">("latest");
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
    setFeedView("latest");
  };

  const clearHashtagFilter = () => {
    setActiveHashtag(null);
  };

  // For You: recommend tweets with hashtags matching those in liked tweets
  const likedHashtags = tweets
    .filter((tweet) => likedTweets.includes(tweet.id))
    .flatMap((tweet) => extractHashtags(tweet.content));
  const forYouTweets = tweets
    .filter(
      (tweet) =>
        extractHashtags(tweet.content).some((tag) =>
          likedHashtags.includes(tag)
        ) && !likedTweets.includes(tweet.id)
    )
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

  const filteredTweets = activeHashtag
    ? tweets.filter((tweet) => tweet.content.includes(`#${activeHashtag}`))
    : tweets;

  let tweetsToShow = filteredTweets;
  if (feedView === "foryou") {
    tweetsToShow = forYouTweets;
  }

  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mini Twitter Feed</h1>
      <FeedHeader
        feedView={feedView}
        setFeedView={setFeedView}
        activeHashtag={activeHashtag}
        clearHashtagFilter={clearHashtagFilter}
      />
      <TweetForm
        value={tweetContent}
        onChange={setTweetContent}
        onSubmit={handleSubmit}
        submitting={submitting}
        maxChars={maxChars}
      />
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <svg
            className="animate-spin h-8 w-8 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        </div>
      ) : (
        <TweetList
          tweets={tweetsToShow}
          likedTweets={likedTweets}
          replyingTo={replyingTo}
          replyContent={replyContent}
          onLike={handleLike}
          onReply={handleReply}
          onDelete={handleDelete}
          onReplyContentChange={setReplyContent}
          onReplySubmit={handleReplySubmit}
          parseHashtags={parseHashtags}
          maxChars={maxChars}
          replySubmitting={replySubmitting}
          handleHashtagClick={handleHashtagClick}
          animateNew={true}
        />
      )}
    </main>
  );
}
