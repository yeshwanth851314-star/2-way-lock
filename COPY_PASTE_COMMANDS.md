# 📋 Copy & Paste Git Bash Commands

## ⚡ Super Quick (Just Copy & Paste These)

### Step 1: Open Git Bash
Right-click in your project folder → **"Git Bash Here"**

### Step 2: Copy & Paste These Commands (One by One)

```bash
git config --global user.name "Your Name"
```

```bash
git config --global user.email "your.email@example.com"
```

```bash
git init
```

```bash
git add .
```

```bash
git commit -m "Initial commit: 2 Way Lock - Professional networking platform"
```

```bash
git remote add origin https://github.com/yourusername/2-way-lock.git
```

```bash
git branch -M main
```

```bash
git push -u origin main
```

---

## 📝 Replace These Values

Before running the commands, replace:

| Placeholder | Replace With | Example |
|------------|--------------|---------|
| `Your Name` | Your actual name | `John Doe` |
| `your.email@example.com` | Your email | `john@example.com` |
| `yourusername` | Your GitHub username | `johndoe` |

---

## 🔑 Authentication

When you run `git push -u origin main`, you'll be prompted:

```
Username for 'https://github.com': [Enter your GitHub username]
Password for 'https://yourusername@github.com': [Paste your Personal Access Token]
```

### Get Personal Access Token

1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Click "Generate new token"
3. Name: `2-way-lock-push`
4. Select: `repo` and `workflow`
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)
7. Paste it when Git Bash asks for password

---

## ✅ Verify Success

After all commands complete, run:

```bash
git log --oneline
```

You should see:
```
1234567 Initial commit: 2 Way Lock - Professional networking platform
```

Then visit: `https://github.com/yourusername/2-way-lock`

---

## 🐛 If Something Goes Wrong

### Error: "fatal: not a git repository"
```bash
git init
```

### Error: "fatal: remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/yourusername/2-way-lock.git
```

### Error: "Authentication failed"
- Use Personal Access Token (not your GitHub password)
- Or use SSH key
- Or use GitHub CLI: `gh auth login`

### Error: "nothing to commit, working tree clean"
```bash
git push -u origin main
```

---

## 📚 All Commands in One Block

If you want to run all at once (paste into Git Bash):

```bash
git config --global user.name "Your Name" && \
git config --global user.email "your.email@example.com" && \
git init && \
git add . && \
git commit -m "Initial commit: 2 Way Lock - Professional networking platform" && \
git remote add origin https://github.com/yourusername/2-way-lock.git && \
git branch -M main && \
git push -u origin main
```

---

## 🎯 Next Steps

After successful push:

### 1. Verify on GitHub
```bash
# Visit your repository
https://github.com/yourusername/2-way-lock
```

### 2. Deploy to Vercel
```bash
npm i -g vercel
vercel login
vercel --prod
```

### 3. Add Environment Variables
In Vercel Dashboard → Settings → Environment Variables:
```
DATABASE_URL=your-database-url
REDIS_URL=your-redis-url
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-jwt-refresh-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://yourdomain.vercel.app/api/v1/auth/google/callback
OPENAI_API_KEY=your-openai-key
NODE_ENV=production
```

---

## 💡 Useful Commands

```bash
# Check status
git status

# View commit history
git log --oneline

# View branches
git branch -a

# View remote URLs
git remote -v

# Create new branch
git checkout -b feature/your-feature

# Switch branch
git checkout main

# Pull latest
git pull origin main

# Push changes
git push origin main
```

---

## 🔒 Security Tips

1. **Never commit .env file** (already in .gitignore)
2. **Use Personal Access Token** for authentication
3. **Don't share your token** with anyone
4. **Enable 2FA** on GitHub account
5. **Review .gitignore** before committing

---

## ✨ That's It!

Your repository is now on GitHub! 🎉

**Next:** Deploy to Vercel using the commands above.

---

**Questions?** See GIT_BASH_QUICK_START.md for detailed help.
