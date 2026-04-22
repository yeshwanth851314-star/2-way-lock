# 2 Way Lock

**Where seekers and givers meet — verified, meaningful, mutual.**

A full-stack professional networking platform built for both job seekers and employers equally. Think of it as LinkedIn reimagined with startup culture, AI intelligence, mutual trust, and zero ads/premium tiers.

## ✨ Key Features

- ✅ **Two-Way Design** - Every feature serves both seekers AND employers equally
- ✅ **Verified Only** - All users must verify before accessing feeds or posting
- ✅ **AI-Powered** - GPT-4o matching connects right people with right opportunities
- ✅ **Google OAuth** - One-click login with Google authentication
- ✅ **Startup Ecosystem** - Dedicated tier system (🦄 Unicorn, 🚀 Mid-Level, 🌱 Just Started)
- ✅ **Zero Ads** - No premium tiers, no promoted content, ever
- ✅ **Threat-Safe** - Every file scanned for malware, NSFW, and threats

## 🏗️ Tech Stack

### Backend
- Node.js + Express.js (REST API)
- PostgreSQL (Prisma ORM)
- Redis (sessions, caching)
- Socket.io (real-time)
- JWT + Google OAuth 2.0

### Frontend (Separate Repo)
- React 18 + TypeScript
- Tailwind CSS + Framer Motion
- React Router v6
- Zustand + React Query

### AI & Security
- OpenAI GPT-4o
- Google OAuth 2.0
- ClamAV + VirusTotal
- Google Safe Browsing

### Deployment
- Docker + Docker Compose
- Vercel (serverless)
- GitHub Actions CI/CD

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose

### Local Development

```bash
# Clone and setup
git clone https://github.com/yourusername/2-way-lock.git
cd 2-way-lock
cp .env.example .env

# Start services
docker-compose up -d

# Run migrations
docker-compose exec api npm run db:migrate

# Seed database
docker-compose exec api npm run db:seed

# Access API
curl http://localhost:3000/health
```

## 🔐 Authentication

### Email & Password
```bash
POST /api/v1/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "accountType": "INDIVIDUAL"
}

POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Google OAuth
```bash
POST /api/v1/auth/google
{
  "googleId": "google_id",
  "email": "user@example.com",
  "name": "User Name",
  "picture": "https://..."
}
```

## 📋 API Routes

### Authentication
- `POST /api/v1/auth/register` - Register
- `POST /api/v1/auth/verify-email` - Verify OTP
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/google` - Google OAuth
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout

### Profile
- `GET /api/v1/profile/:userId` - Get profile
- `GET /api/v1/profile/me` - Get current user
- `PUT /api/v1/profile` - Update profile
- `POST /api/v1/profile/certifications` - Add cert
- `POST /api/v1/profile/projects` - Add project
- `POST /api/v1/profile/skills` - Add skill

### Jobs
- `GET /api/v1/jobs` - List jobs
- `GET /api/v1/jobs/:id` - Get job
- `POST /api/v1/jobs` - Create job (company)
- `POST /api/v1/jobs/:id/apply` - Apply
- `GET /api/v1/jobs/:id/applications` - Get applications

## 🌍 Environment Variables

```bash
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/2way_lock_dev"
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-key"

# Google OAuth
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3000/api/v1/auth/google/callback"

# OpenAI
OPENAI_API_KEY="sk-..."

# App
NODE_ENV="development"
PORT="3000"
FRONTEND_URL="http://localhost:5173"
```

## 🚀 Deploy to Vercel

### 1. Push to GitHub
```bash
git push origin main
```

### 2. Connect to Vercel
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Select your GitHub repository
- Click "Import"

### 3. Set Environment Variables
In Vercel Dashboard → Settings → Environment Variables, add:
- `DATABASE_URL`
- `REDIS_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL`
- `OPENAI_API_KEY`

### 4. Deploy
```bash
vercel deploy --prod
```

## 📦 Building for Production

```bash
# Build
npm run build

# Build Docker image
docker build -t 2way-lock:latest .

# Run
docker-compose up -d
```

## 🧪 Testing

```bash
npm run test:run      # Run tests
npm run type-check    # Type check
npm run lint          # Lint code
```

## 📚 Documentation

- [GETTING_STARTED.md](./GETTING_STARTED.md) - Setup guide
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System design
- [API_REFERENCE.md](./API_REFERENCE.md) - API docs
- [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) - Building guide

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🎓 Roadmap

- ✅ Phase 1: Foundation & Auth
- ⏳ Phase 2: AI Matching
- ⏳ Phase 3: Social Features
- ⏳ Phase 4: Security & Scanning
- ⏳ Phase 5: Admin Panel

---

**Built with ❤️ for the professional community**
