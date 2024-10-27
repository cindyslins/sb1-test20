import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_KV_REST_API_URL,
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_KV_REST_API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Posts
export const getPosts = async (sort = 'new', subreddit?: string, search?: string) => {
  const response = await api.get(`/${import.meta.env.VITE_KV_DATABASE}/posts/all`);
  let posts = response.data || [];
  
  if (search) {
    posts = posts.filter(post => 
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.content.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (subreddit) {
    posts = posts.filter(post => post.subreddit === subreddit);
  }
  
  if (sort === 'top') {
    posts.sort((a, b) => b.votes - a.votes);
  } else if (sort === 'new') {
    posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  return { data: posts };
};

export const createPost = async (data: { title: string; content: string; subreddit: string }) => {
  const posts = (await api.get(`/${import.meta.env.VITE_KV_DATABASE}/posts/all`)).data || [];
  const newPost = {
    id: generateId(),
    ...data,
    votes: 0,
    comments: [],
    createdAt: new Date().toISOString(),
    author: localStorage.getItem('username') || 'anonymous'
  };
  
  posts.push(newPost);
  await api.post(`/${import.meta.env.VITE_KV_DATABASE}/posts/all`, posts);
  return { data: newPost };
};

// Auth
export const login = async (username: string, password: string) => {
  const users = (await api.get(`/${import.meta.env.VITE_KV_DATABASE}/users/all`)).data || [];
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  localStorage.setItem('username', username);
  return { data: { user, token: 'mock-token' } };
};

export const register = async (username: string, password: string) => {
  const users = (await api.get(`/${import.meta.env.VITE_KV_DATABASE}/users/all`)).data || [];
  
  if (users.find(u => u.username === username)) {
    throw new Error('Username taken');
  }
  
  const newUser = {
    id: generateId(),
    username,
    password,
    karma: 0,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  await api.post(`/${import.meta.env.VITE_KV_DATABASE}/users/all`, users);
  
  localStorage.setItem('username', username);
  return { data: { user: newUser, token: 'mock-token' } };
};

// Comments
export const addComment = async (postId: string, content: string) => {
  const posts = (await api.get(`/${import.meta.env.VITE_KV_DATABASE}/posts/all`)).data || [];
  const post = posts.find(p => p.id === postId);
  
  if (!post) throw new Error('Post not found');
  
  const newComment = {
    id: generateId(),
    content,
    author: localStorage.getItem('username') || 'anonymous',
    votes: 0,
    createdAt: new Date().toISOString()
  };
  
  post.comments.push(newComment);
  await api.post(`/${import.meta.env.VITE_KV_DATABASE}/posts/all`, posts);
  return { data: newComment };
};

// Votes
export const votePost = async (postId: string, value: number) => {
  const posts = (await api.get(`/${import.meta.env.VITE_KV_DATABASE}/posts/all`)).data || [];
  const post = posts.find(p => p.id === postId);
  
  if (!post) throw new Error('Post not found');
  
  post.votes += value;
  await api.post(`/${import.meta.env.VITE_KV_DATABASE}/posts/all`, posts);
  return { data: post };
};