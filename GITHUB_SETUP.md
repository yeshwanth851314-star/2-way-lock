# GitHub & Vercel Setup Guide

## 📝 Step 1: Create GitHub Repository

### Option A: Using GitHub Web Interface
1. Go to [github.com/new](https://github.com/new)
2. Repository name: `2-way-lock`
3. Description: "Where seekers and givers meet — verified, meaningful, mutual."
4. Choose: Public (for open source) or Private
5. Click "Create repository"

### Option B: Using GitHub CLI
```bash
gh repo create 2-way-lock --public --source=. --remote=origin --push
```

## 🔧 Step 2: Initialize Git Repository Locally

```bash
# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: 2 Way Lock foundation"

# Add remote
git remote add origin https://github.com/yourusername/2-way-lock.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 🌐 Step 3: Setup Google OAuth

### Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: "2 Way Lock"
3. Enable APIs:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"
4. Create OAuth 2.0 Credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/v1/auth/google/callback` (local)
     - `https://yourdomain.vercel.app/api/v1/auth/google/callback` (production)
   - Copy Client ID and Client Secret

### Update .env
```bash
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3000/api/v1/auth/google/callback"
```

## 🚀 Step 4: Deploy to Vercel

### Option A: Using Vercel Web Interface

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Select your `2-way-lock` repository
5. Click "Import"
6. Configure project:
   - Framework: "Other"
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
7. Add Environment Variables:
   ```
   DATABASE_URL = your-database-url
   REDIS_URL = your-redis-url
   JWT_SECRET = your-jwt-secret
   JWT_REFRESH_SECRET = your-jwt-refresh-secret
   GOOGLE_CLIENT_ID = your-google-client-id
   GOOGLE_CLIENT_SECRET = your-google-client-secret
   GOOGLE_CALLBACK_URL = https://yourdomain.vercel.app/api/v1/auth/google/callback
   OPENAI_API_KEY = your-openai-key
   NODE_ENV = production
   ```
8. Click "Deploy"

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Set environment variables
vercel env add DATABASE_URL
vercel env add REDIS_URL
vercel env add JWT_SECRET
vercel env add JWT_REFRESH_SECRET
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add GOOGLE_CALLBACK_URL
vercel env add OPENAI_API_KEY
```

## 🗄️ Step 5: Setup Database

### Using Vercel Postgres (Recommended)

1. Go to Vercel Dashboard
2. Select your project
3. Go to "Storage" tab
4. Click "Create Database" → "Postgres"
5. Copy the connection string
6. Add to environment variables:
   ```
   DATABASE_URL = your-vercel-postgres-url
   ```

### Using External Database

If using external PostgreSQL:
1. Get connection string from your provider
2. Add to Vercel environment variables
3. Ensure database is accessible from Vercel

### Setup Redis

1. Use [Upstash Redis](https://upstash.com/) (free tier available)
2. Create a new database
3. Copy the connection string
4. Add to Vercel environment variables:
   ```
   REDIS_URL = your-upstash-redis-url
   ```

## 🔑 Step 6: Setup Secrets

### GitHub Secrets (for CI/CD)

1. Go to GitHub repository
2. Settings → Secrets and variables → Actions
3. Add secrets:
   - `VERCEL_TOKEN` - Get from [Vercel Settings](https://vercel.com/account/tokens)
   - `VERCEL_ORG_ID` - Your Vercel organization ID
   - `VERCEL_PROJECT_ID` - Your Vercel project ID

### Get Vercel IDs

```bash
# After deploying to Vercel
vercel projects list
vercel projects list --json
```

## 📋 Step 7: Configure GitHub Actions

The `.github/workflows/deploy.yml` file is already configured. It will:
1. Run tests on every push
2. Type check code
3. Lint code
4. Deploy to Vercel on main branch

## ✅ Step 8: Verify Setup

### Test Local Development
```bash
npm install
npm run dev
curl http://localhost:3000/health
```

### Test Production Deployment
```bash
# Check Vercel deployment
vercel --prod

# Visit your Vercel URL
https://yourdomain.vercel.app/health
```

### Test Google OAuth
1. Go to your app
2. Click "Login with Google"
3. Verify it redirects correctly
4. Check that user is created in database

## 🔄 Step 9: Setup CI/CD Pipeline

The GitHub Actions workflow will automatically:
1. Run on every push to `main` or `develop`
2. Run tests
3. Type check
4. Lint code
5. Deploy to Vercel

### Monitor Deployments
1. Go to GitHub repository
2. Click "Actions" tab
3. View workflow runs
4. Check deployment status

## 📚 Step 10: Documentation

Update these files with your actual URLs:

### README.md
- Replace `yourusername` with your GitHub username
- Replace `yourdomain.vercel.app` with your Vercel domain

### .env.example
- Update `GOOGLE_CALLBACK_URL` with your Vercel domain
- Update `FRONTEND_URL` with your frontend URL

## 🎯 Final Checklist

- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Google OAuth credentials created
- [ ] Vercel project created
- [ ] Database configured
- [ ] Redis configured
- [ ] Environment variables set
- [ ] GitHub secrets configured
- [ ] CI/CD pipeline working
- [ ] Deployment successful
- [ ] Google OAuth tested
- [ ] API endpoints tested

## 🚨 Troubleshooting

### Deployment Failed
1. Check Vercel logs: `vercel logs`
2. Check GitHub Actions: Repository → Actions
3. Verify environment variables are set
4. Check database connection

### Google OAuth Not Working
1. Verify Client ID and Secret are correct
2. Check redirect URI matches exactly
3. Verify domain is added to Google Console
4. Check browser console for errors

### Database Connection Failed
1. Verify DATABASE_URL is correct
2. Check database is accessible from Vercel
3. Run migrations: `npm run db:migrate`
4. Check Prisma schema

### Redis Connection Failed
1. Verify REDIS_URL is correct
2. Check Redis is accessible from Vercel
3. Test connection locally first
4. Check firewall rules

## 📞 Support

- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Prisma Documentation](https://www.prisma.io/docs/)

---

**Your 2 Way Lock is now live! 🚀**
