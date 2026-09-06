#!/usr/bin/env bash

# Compile TypeScript files recursively in subdirectories using tsc into JavaScript (.js) files
# Usage: ./compile.sh [src_dir] [out_dir]

set -e

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

SRC_DIR="${1:-src}"
OUT_DIR="${2:-dist-js}"

echo -e "${BLUE}=== Starting TypeScript Compilation (.ts -> .js) ===${NC}"

# Check if tsc command is available
if command -v tsc &> /dev/null; then
  TSC_CMD="tsc"
elif npx tsc --version &> /dev/null; then
  TSC_CMD="npx tsc"
else
  echo -e "${RED}Error: tsc (TypeScript compiler) is not installed.${NC}"
  echo "Please run: npm install -D typescript"
  exit 1
fi

echo -e "${BLUE}Compiler:${NC} $($TSC_CMD --version)"
echo -e "${BLUE}Target directory:${NC} ${SRC_DIR}"
echo -e "${BLUE}Output directory:${NC} ${OUT_DIR}"

# Find all .ts and .d.ts files recursively in SRC_DIR
TS_FILES=$(find "${SRC_DIR}" -type f \( -name "*.ts" -o -name "*.tsx" \) ! -path "*/node_modules/*")

if [ -z "$TS_FILES" ]; then
  echo -e "${RED}No .ts files found in ${SRC_DIR}${NC}"
  exit 1
fi

echo -e "${BLUE}Found files to compile:${NC}"
echo "$TS_FILES" | sed 's/^/  - /'

# Run tsc with --ignoreConfig to override 'noEmit: true' in tsconfig.json
$TSC_CMD --ignoreConfig $TS_FILES \
  --outDir "${OUT_DIR}" \
  --target ES2020 \
  --module ESNext \
  --moduleResolution bundler \
  --skipLibCheck

echo -e "${GREEN}✔ TypeScript files compiled successfully to '${OUT_DIR}'!${NC}"
