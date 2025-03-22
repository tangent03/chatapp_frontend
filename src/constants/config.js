// Get environment-specific server URL
const isDev = import.meta.env.DEV;
const devServer = 'http://localhost:3000';
const prodServer = import.meta.env.VITE_API_URL || 'https://chatapp-server-xoea.onrender.com';

export const server = isDev ? devServer : prodServer;

export const SOCKET_ENDPOINT = server;

// Fallback avatar URL
export const avatarFallback = 'https://ui-avatars.com/api';

// Other constants
// ...