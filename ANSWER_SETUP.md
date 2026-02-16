# Question Answers Setup

## What This Does
When users answer questions in the app, their answers are automatically submitted as GitHub Issues in your repository.

## Setup Instructions

### 1. Environment Variables
The system uses environment variables to securely store your GitHub token:

- `.env.local` file contains:
  - `NEXT_PUBLIC_GITHUB_TOKEN`: Your GitHub personal access token
  - `NEXT_PUBLIC_GITHUB_REPO`: Your repository (default: Helios12z/Helios12z)

### 2. GitHub Token Permissions
The token needs these scopes:
- ✅ `public_repo` - Access to public repositories
- ✅ `gist` - Create gists (optional)

### 3. Where to Find Answers
Answers will appear in your GitHub repository under:
- **Issues** tab - labeled with "question-answer"
- Each answer is a separate issue with the question text and user's response

### 4. Security Notes
- The `.env.local` file is NOT committed to git
- Tokens are only available on the client side (Next.js Pages)
- For production, consider using server-side API routes

### 5. Troubleshooting
If answers don't appear:
1. Check browser console (F12) for error messages
2. Verify your token has correct permissions
3. Ensure repository is public (GitHub Pages requirement)
4. Check if issues are being created in the correct repository

### 6. Fallback
If GitHub submission fails, answers are logged in the browser console (accessible via F12).