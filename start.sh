#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "1. Building Web/ImageMerger (TypeScript compilation & Vite bundle)..."
npm --prefix Web/ImageMerger run build

echo "2. Starting http-server without caching (-c-1)..."
npx http-server -c-1
