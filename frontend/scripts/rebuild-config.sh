#!/usr/bin/env bash
set -e

echo "Reloading .env and clearing Vite cache..."
# Remove Vite cache
rm -rf node_modules/.vite || true
# Show configured API URL
echo "VITE_APP_API_URL=$(grep -m1 '^VITE_APP_API_URL' .env || echo 'not set')"

echo "Installing dependencies (if needed) and starting the dev server"
# We assume yarn is the package manager
if command -v yarn >/dev/null 2>&1; then
  yarn install --immutable || true
  yarn build || true
else
  npm install || true
  npm run build || true
fi

echo "Run 'yarn start' or 'npm start' to run the dev server now."