import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import TweetList from "./TweetList";
import { Tweet } from "../types";

const meta: Meta<typeof TweetList> = {
  title: "Components/TweetList",
  component: TweetList,
};
export default meta;

type Story = StoryObj<typeof TweetList>;

const tweets: Tweet[] = [
  {
    id: "1",
    username: "user123",
    content: "Hello, world! #coding",
    timestamp: new Date().toISOString(),
    likes: 3,
    replies: [
      {
        id: "2",
        username: "user456",
        content: "Welcome to Twitter! #hello",
        timestamp: new Date().toISOString(),
        likes: 1,
      },
    ],
  },
  {
    id: "3",
    username: "user789",
    content: "Another tweet #react",
    timestamp: new Date().toISOString(),
    likes: 2,
    replies: [],
  },
];

export const Default: Story = {
  render: () => {
    const [replyContent, setReplyContent] = useState("");
    return (
      <TweetList
        tweets={tweets}
        likedTweets={[]}
        replyingTo={null}
        replyContent={replyContent}
        onLike={() => {}}
        onReply={() => {}}
        onDelete={() => {}}
        onReplyContentChange={setReplyContent}
        onReplySubmit={(e) => e.preventDefault()}
        parseHashtags={(content) => content}
        maxChars={280}
        replySubmitting={false}
        handleHashtagClick={() => {}}
      />
    );
  },
};
