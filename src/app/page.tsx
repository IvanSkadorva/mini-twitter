"use client";

import React, { useEffect, useState, useRef } from "react";
import { parseHashtags, extractHashtags } from "../utils/helpers";
import {
  getTweets,
  postTweet,
  likeTweet,
  replyToTweet,
  deleteTweet,
} from "../api/tweets";
import {
  FeedView,
  DEMO_USERS,
  MAX_TWEET_CHARS,
  ErrorMessages,
  DELETE_CONFIRMATION,
  APP_TITLE,
  USER_LABEL,
} from "../types";

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

import TweetForm from "../components/TweetForm";
import TweetList from "../components/TweetList";
import FeedHeader from "../components/FeedHeader";
import TweetFormSkeleton from "../components/TweetFormSkeleton";
import TweetSkeleton from "../components/TweetSkeleton";
import ErrorBanner from "../components/ErrorBanner";

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
  const [feedView, setFeedView] = useState<FeedView>(FeedView.Latest);
  const maxChars = MAX_TWEET_CHARS;
  const [error, setError] = useState("");

  const [currentUser, setCurrentUser] = useState(DEMO_USERS[0].username);

  useEffect(() => {
    getTweets().then((data) => {
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
      await postTweet(newTweet);
    } catch (err) {
      setError(ErrorMessages.PostFailed);
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
    const tweet = tweets.find((t) => t.id === tweetId);
    if (!tweet) return;
    try {
      await likeTweet(tweetId, tweet.likes + 1);
    } catch (err) {
      setError(ErrorMessages.LikeFailed);
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
    const tweet = tweets.find((t) => t.id === tweetId);
    if (!tweet) return;
    try {
      await replyToTweet(tweetId, [...tweet.replies, newReply]);
    } catch (err) {
      setError(ErrorMessages.ReplyFailed);
    } finally {
      setReplySubmitting(false);
    }
  };

  const handleDelete = async (tweetId: string) => {
    const confirmed = window.confirm(DELETE_CONFIRMATION);
    if (!confirmed) return;
    setTweets((prev) => prev.filter((tweet) => tweet.id !== tweetId)); // Optimistic UI
    try {
      await deleteTweet(tweetId);
    } catch (err) {
      setError(ErrorMessages.DeleteFailed);
    }
  };

  const handleHashtagClick = (tag: string) => {
    setActiveHashtag(tag);
    setFeedView(FeedView.Latest);
  };

  const clearHashtagFilter = () => {
    setActiveHashtag(null);
  };

  const filteredTweets = activeHashtag
    ? tweets.filter((tweet) => tweet.content.includes(`#${activeHashtag}`))
    : tweets;

  const latestTweets = [...filteredTweets].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const likedHashtags = tweets
    .filter((tweet) => likedTweets.includes(tweet.id))
    .flatMap((tweet) => extractHashtags(tweet.content));

  const forYouTweets = filteredTweets
    .filter((tweet) => likedTweets.includes(tweet.id))
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

  let tweetsToShow = feedView === FeedView.ForYou ? forYouTweets : latestTweets;

  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{APP_TITLE}</h1>
      <ErrorBanner message={error} onClose={() => setError("")} />
      <div className="mb-2 flex items-center gap-2">
        <span className="text-sm text-gray-500">{USER_LABEL}</span>
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
