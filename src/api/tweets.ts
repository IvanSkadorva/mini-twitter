import { Tweet, Reply } from "../types";

const API_URL = "http://localhost:3001/tweets";

export async function getTweets(): Promise<Tweet[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch tweets");
  return res.json();
}

export async function postTweet(tweet: Tweet): Promise<Tweet> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tweet),
  });
  if (!res.ok) throw new Error("Failed to post tweet");
  return res.json();
}

export async function likeTweet(id: string, likes: number): Promise<Tweet> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ likes }),
  });
  if (!res.ok) throw new Error("Failed to like tweet");
  return res.json();
}

export async function replyToTweet(
  id: string,
  replies: Reply[]
): Promise<Tweet> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ replies }),
  });
  if (!res.ok) throw new Error("Failed to reply to tweet");
  return res.json();
}

export async function deleteTweet(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete tweet");
}
