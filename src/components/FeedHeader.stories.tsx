import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import FeedHeader from "./FeedHeader";

const meta: Meta<typeof FeedHeader> = {
  title: "Components/FeedHeader",
  component: FeedHeader,
};
export default meta;

type Story = StoryObj<typeof FeedHeader>;

export const Default: Story = {
  render: () => (
    <FeedHeader
      feedView="latest"
      setFeedView={() => {}}
      activeHashtag={null}
      clearHashtagFilter={() => {}}
    />
  ),
};

export const WithHashtag: Story = {
  render: () => (
    <FeedHeader
      feedView="foryou"
      setFeedView={() => {}}
      activeHashtag="coding"
      clearHashtagFilter={() => {}}
    />
  ),
};
