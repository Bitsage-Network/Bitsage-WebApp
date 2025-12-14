#!/bin/bash

echo "🔧 Adding all changes..."
git add -A

echo "📝 Committing changes..."
git commit -m "feat: rebrand from WebApp to Validator Dashboard and fix mobile docs layout

- Update package.json name to bitsage-validator
- Update all metadata titles and descriptions
- Fix docs page mobile responsiveness (add padding, improve layout)
- Update README and DEPLOYMENT docs with new name
- Separate viewport export for Next.js 14 compatibility"

echo "🚀 Pushing to GitHub..."
git push origin main

echo "✅ Deploying to Vercel..."
vercel --prod

echo "✨ Done!"

