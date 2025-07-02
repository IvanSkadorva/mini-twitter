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

  useEffect(() => {
    fetch("http://localhost:3001/tweets")
      .then((res) => res.json())
      .then((data) => {
        setTweets(data);
        setLoading(false);
      });
  }, []);

  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mini Twitter Feed</h1>
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
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
