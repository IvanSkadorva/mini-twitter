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
import TweetFormSkeleton from "../components/TweetFormSkeleton";
import TweetSkeleton from "../components/TweetSkeleton";

function ErrorBanner({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  if (!message) return null;
  return (
    <div
      className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-4 flex items-center justify-between"
      role="alert"
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-red-700 font-bold text-lg leading-none focus:outline-none"
      >
        &times;
      </button>
    </div>
  );
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
  const [feedView, setFeedView] = useState<"latest" | "foryou">("latest");
  const maxChars = 280;
  const [error, setError] = useState("");

  const DEMO_USERS = [
    { username: "alice" },
    { username: "bob" },
    { username: "charlie" },
  ];
  const [currentUser, setCurrentUser] = useState(DEMO_USERS[0].username);

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
      username: currentUser,
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
      setError("Failed to post tweet. Please try again later.");
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
      setError("Failed to like tweet. Please try again later.");
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
      username: currentUser,
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
      setError("Failed to reply to tweet. Please try again later.");
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
      setError("Failed to delete tweet. Please try again later.");
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
      <ErrorBanner message={error} onClose={() => setError("")} />
      <div className="mb-2 flex items-center gap-2">
        <span className="text-sm text-gray-500">User:</span>
        <select
          value={currentUser}
          onChange={(e) => setCurrentUser(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          {DEMO_USERS.map((u) => (
            <option key={u.username} value={u.username}>
              @{u.username}
            </option>
          ))}
        </select>
      </div>
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
        username={currentUser}
      />
      {loading ? (
        <>
          <TweetFormSkeleton />
          <ul className="space-y-4">
            <TweetSkeleton />
            <TweetSkeleton />
            <TweetSkeleton />
          </ul>
        </>
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
