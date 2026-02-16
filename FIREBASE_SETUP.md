# Firebase Integration Setup

## What This Does
When users answer questions, their answers are automatically saved to Firebase Firestore.

## Setup Instructions

### 1. Firebase Configuration
✅ **Already configured** - Firebase is set up with your provided credentials

### 2. Data Storage
- **Collection**: `answers`
- **Document structure**:
  ```typescript
  {
    question: "Question text",
    answer: "User's answer",
    timestamp: ISO string,
    questionId: number,
    questionNumber: number
  }
  ```

### 3. Viewing the Answers

#### Option A: Admin Page
Visit: `https://your-domain.com/admin-answers`
- Shows all answers in a beautiful interface
- Auto-refreshes (you need to manually refresh)
- Shows newest answers first

#### Option B: Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: "wangandtramloveletter"
3. Go to Firestore Database
4. Look for the "answers" collection

### 4. Local Development
Answers are also saved to localStorage as a backup in case Firebase fails.

### 5. Security Notes
- Firebase rules are set to public by default
- For production, consider setting up authentication rules
- Your Firebase project is publicly accessible

### 6. Troubleshooting
If answers don't appear:
1. Check browser console (F12) for errors
2. Verify Firebase configuration in `/src/lib/firebase.ts`
3. Check Firestore database for new documents
4. Ensure your Firebase project is enabled

### 7. Admin Access
The admin page at `/admin-answers` will show you all submitted answers with:
- Question number and text
- User's answer
- Timestamp
- Beautiful UI with animations

### 8. Production Notes
- Make sure to set up proper Firebase security rules for production
- Consider adding authentication to protect the admin page
- Firebase has free tier limits (check Firebase pricing for details)