// API Configuration
// During development: replace with your Mac's local IP address.
// Find it with: ifconfig | grep "inet " (Mac/Linux)
// Example: http://192.168.1.42:5000
//
// For production: replace with your deployed backend URL.

export const API_BASE_URL = 'http://YOUR_MAC_IP:5000';

export const ENDPOINTS = {
  chat: `${API_BASE_URL}/api/chat`,
  health: `${API_BASE_URL}/health`,
};

export const APP_NAME = 'On My Deen';
export const APP_TAGLINE = 'Your Islamic Faith Companion';
