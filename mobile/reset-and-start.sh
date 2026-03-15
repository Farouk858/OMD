#!/bin/bash
set -e

echo "=== Stopping any running expo/node processes ==="
pkill -f "expo start" 2>/dev/null || true
pkill -f "react-native" 2>/dev/null || true

echo "=== Pulling latest changes ==="
cd "$(dirname "$0")"
git fetch origin claude/islamic-qa-app-StCqq
git checkout claude/islamic-qa-app-StCqq
git pull origin claude/islamic-qa-app-StCqq

echo "=== Cleaning everything ==="
rm -rf node_modules package-lock.json .expo

echo "=== Installing dependencies ==="
npm install --legacy-peer-deps

echo "=== Verifying expo version ==="
node -e "console.log('expo version:', require('./node_modules/expo/package.json').version)"

echo "=== Starting expo ==="
npx expo start --tunnel --clear
