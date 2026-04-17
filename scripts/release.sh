#!/usr/bin/env bash
set -euo pipefail

VERSION_TYPE="${1:-}"

if [[ "$VERSION_TYPE" != "patch" && "$VERSION_TYPE" != "minor" && "$VERSION_TYPE" != "major" ]]; then
  echo "Usage: $0 <patch|minor|major>"
  exit 1
fi

if ! npm whoami &>/dev/null; then
  echo "Error: npm is not logged in. Run 'npm login' first."
  exit 1
fi

CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "Current version: v${CURRENT_VERSION}"
echo "Bump type: ${VERSION_TYPE}"
echo ""

echo "==> Running tests..."
npm test

echo ""
echo "==> Building..."
npm run build

echo ""
echo "==> Bumping version (${VERSION_TYPE})..."
npm version "$VERSION_TYPE" -m "chore: release v%s"

NEW_VERSION=$(node -p "require('./package.json').version")
echo ""
echo "==> Pushing commit and tag v${NEW_VERSION}..."
git push --follow-tags

echo ""
echo "==> Publishing to npm..."
npm publish

echo ""
echo "Done! Released v${NEW_VERSION}"
