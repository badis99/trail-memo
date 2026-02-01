# 🎯 TrailMemo - Decision Tracking & Reflection Platform

A full-stack web application that helps users track decisions, record expected outcomes, and later reflect on what actually happened to improve decision-making over time.

![Status](https://img.shields.io/badge/status-completed-success)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## ✨ Features

- 🔐 **Authentication** - JWT-based secure login/signup
- 📝 **Decision Tracking** - Create decisions with context and expected outcomes
- ✅ **Review System** - Reflect on decisions after time passes
- 🏷️ **Tags** - Organize decisions by category (career, study, health, finance, personal)
- 📊 **Dashboard** - View stats and recent decisions
- 🎨 **Modern UI** - Dark glassmorphism design with smooth animations
- 🔍 **Filtering** - Filter by status (pending/reviewed) and tags

## 🛠️ Tech Stack

### Backend
- **NestJS** - TypeScript Node.js framework
- **Prisma** - ORM for database management
- **PostgreSQL** - Relational database
- **JWT** - Authentication
- **Passport** - Authentication middleware

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client

## 📁 Project Structure
```
trail-memo/
├── backend/          # NestJS backend
│   ├── src/
│   │   ├── auth/
│   │   ├── decisions/
│   │   ├── reviews/
│   │   ├── tags/
│   │   └── prisma/
│   └── prisma/
│       └── schema.prisma
│
└── frontend/         # Next.js frontend
    ├── src/
    │   ├── app/
    │   ├── services/
    │   └── lib/
    └── public/
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 13+
- npm or pnpm

### Backend Setup
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your database credentials
DATABASE_URL="postgresql://user:password@localhost:5432/trailmemo"
JWT_SECRET="your-super-secret-key"
JWT_EXPIRES_IN="15m"

# Run Prisma migrations
npx prisma migrate dev --name init

# Seed database with tags
npx prisma db seed

# Start development server
npm run start:dev
```

Backend will run on `http://localhost:3333`

### Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:3333" > .env.local

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🐳 Docker Setup (Optional)
```bash
# Start PostgreSQL with Docker
docker-compose up -d
```

## 📚 API Documentation

### Authentication
- `POST /auth/signup` - Create new account
- `POST /auth/signin` - Login

### Decisions
- `GET /decisions` - List all decisions (with filters)
- `GET /decisions/:id` - Get single decision
- `POST /decisions` - Create decision
- `PATCH /decisions/:id` - Update decision
- `DELETE /decisions/:id` - Delete decision

### Reviews
- `POST /decisions/:id/review` - Create review for decision

### Tags
- `GET /tags` - List all tags

## 🎯 Key Features Explained

### State Machine
Decisions follow a state transition:
```
PENDING → (user creates review) → REVIEWED
```

Once reviewed, decisions cannot be edited to maintain data integrity.

### Business Logic
- Users can only access their own decisions
- Can only update PENDING decisions
- Optional 1-day waiting period before reviewing
- Review is a one-time action (can't review twice)

## 🎨 Design

The application features a modern dark glassmorphism design with:
- Animated background gradients
- Backdrop blur effects
- Smooth transitions and hover states
- Responsive layout (mobile-friendly)

## 📝 Future Enhancements

- [ ] Email notifications for pending reviews
- [ ] Export decisions as PDF
- [ ] Weekly summary emails
- [ ] Statistics dashboard
- [ ] Public share links
- [ ] Search functionality
- [ ] Markdown support for decision content
