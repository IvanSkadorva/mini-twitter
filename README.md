# Mini Twitter Clone

A simplified, feature-rich Twitter-like web application built with Next.js 15, React, and Tailwind CSS. Includes tweet feed, posting, likes, replies, deletion, hashtag filtering, and a "For You" recommendation tab. All data is served from a mock REST API using json-server.

## Tech Stack
- **Frontend:** Next.js 15 (App Router), React, Tailwind CSS
- **Backend:** Mock REST API (json-server)
- **Component Library:** Storybook
- **Cursor:** for code generation

## Features
- Tweet feed with sorting by most recent
- Post new tweets (with character count and validation)
- Like tweets (one like per session)
- Reply to tweets (one level deep)
- Delete tweets (with confirmation)
- Hashtag parsing and filtering
- "For You" recommendations based on liked hashtags
- Responsive, modern UI with Tailwind CSS
- Optimistic UI updates for all actions
- **User switching:** Post and reply as different demo users (see user switcher at the top)
- **Error handling:** User-friendly error banners if API calls fail
- **Loading skeletons:** Modern skeleton loaders for tweet feed and form

## Component Structure
- `TweetForm`: Form for posting new tweets
- `Tweet`: Displays a tweet, actions, and replies
- `TweetList`: Renders a list of tweets and their replies
- `FeedHeader`: View toggle and hashtag filter bar
- `TweetFormSkeleton`/`TweetSkeleton`: Skeleton loaders for loading states

## Running the App
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the mock backend:
   ```bash
   npm run serve:api
   ```
3. Start the Next.js app:
   ```bash
   npm run dev
   ```
4. Visit [http://localhost:3000](http://localhost:3000)

## Storybook
To view and develop components in isolation:
```bash
npm run storybook
```
Then visit [http://localhost:6006](http://localhost:6006)

## User Switching
- Use the dropdown at the top of the feed to switch between demo users (e.g., alice, bob, charlie).
- The selected user will be used for all new tweets and replies, and their avatar will update accordingly.

## Error Handling
- If the backend is down or an API call fails, a red error banner will appear at the top of the feed.
- The error can be dismissed by clicking the "×" button.

## Loading Skeletons
- While tweets or the form are loading, skeleton loaders are shown instead of spinners for a modern look.

## Reasoning & Decisions
- Used json-server for rapid backend prototyping
- All UI is modular and reusable, with Storybook stories for each component
- Optimistic UI for best user experience
- Hashtag recommendations are based on simple keyword matching for clarity
- User switching and error handling added for realism and robustness

## Further Improvements
- Add user authentication
- Add more advanced recommendation logic
- Add more tests and accessibility improvements

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
