import React from "react";

export function parseHashtags(content: string, onClick: (tag: string) => void) {
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
      React.createElement(
        "button",
        {
          key: match.index,
          className: "text-blue-600 hover:underline inline",
          onClick: () => onClick(tag),
          type: "button",
        },
        `#${tag}`
      )
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }
  return parts;
}

export function extractHashtags(content: string): string[] {
  return (content.match(/#(\w+)/g) || []).map((tag) => tag.slice(1));
}

export function getAvatarColor(username: string) {
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
}
