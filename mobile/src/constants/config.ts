// API Configuration
// Replace this with your Render backend URL once deployed.
// Example: https://on-my-deen-api.onrender.com
//
// For local dev via Codespaces: use the forwarded URL from the Ports tab.

export const API_BASE_URL = 'https://YOUR_APP.onrender.com';

export const ENDPOINTS = {
  chat: `${API_BASE_URL}/api/chat`,
  health: `${API_BASE_URL}/health`,
};

export const APP_NAME = 'On My Deen';
export const APP_TAGLINE = 'Your Islamic Faith Companion';
