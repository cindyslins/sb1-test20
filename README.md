# Reddit Clone

A modern Reddit clone built with React, Vite, and Vercel KV storage.

## Features

- User authentication
- Create and view posts
- Upvote/downvote system
- Comment on posts
- Real-time updates
- Responsive design

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Vite
- Vercel KV Storage
- React Query

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your Vercel KV credentials
4. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file with the following:

```env
VITE_KV_REST_API_TOKEN=your-token
VITE_KV_REST_API_URL=your-kv-url
VITE_KV_DATABASE=your-database-name
```

## Deployment

This project is configured for deployment on Vercel with KV storage.