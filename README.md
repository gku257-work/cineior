# Cineior - Movie Journal & Discovery Application

Premium movie journal and discovery application with Pinterest-style aesthetics.

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animations)
- **React Masonry CSS** (Pinterest-style grid)

### Backend (Microservices)
- **API Gateway** (Spring Cloud Gateway) - Port 8080
- **Auth Service** - Port 8081
- **Movie Service** - Port 8082
- **User Service** - Port 8083
- **PostgreSQL** - Port 5432

### External APIs
- **TMDB** (The Movie Database) - Movie metadata & images

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local frontend development)
- TMDB API Key (get one at https://www.themoviedb.org/settings/api)

### Local Development with Docker

1. **Clone and setup**
```bash
cd cineior
cp .env.example .env
# Edit .env and add your TMDB_API_KEY
```

2. **Start all services**
```bash
docker compose up -d
```

3. **Access the application**
- Frontend: http://localhost:3000
- API Gateway: http://localhost:8080
- Auth Service: http://localhost:8081
- Movie Service: http://localhost:8082
- User Service: http://localhost:8083

### Frontend Only (Development)

```bash
cd frontend
npm install
npm run dev
```

## 🌐 Free Hosting Deployment

### Frontend → Vercel (Recommended)
1. Push your code to GitHub
2. Connect repository to Vercel (https://vercel.com)
3. Set environment variable:
   - `NEXT_PUBLIC_API_URL`: Your backend URL

### Backend → Render (Free Tier)
1. Create separate Web Services for each microservice
2. Connect GitHub repository
3. Set build command: `cd backend/<service-name> && mvn package -DskipTests`
4. Set start command: `java -jar target/*.jar`
5. Add environment variables:
   - `SPRING_DATASOURCE_URL`: PostgreSQL connection string
   - `SPRING_DATASOURCE_USERNAME`: db username
   - `SPRING_DATASOURCE_PASSWORD`: db password
   - `TMDB_API_KEY`: Your TMDB API key
   - `JWT_SECRET`: Secure random string

### Database → Render PostgreSQL / Supabase
- Render: Free PostgreSQL with 1GB storage
- Supabase: Free tier with 500MB

## 📁 Project Structure

```
cineior/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # Pages (App Router)
│   │   ├── components/      # React components
│   │   ├── context/         # Context providers
│   │   ├── lib/             # API client, utilities
│   │   └── types/           # TypeScript types
│   └── Dockerfile
│
├── backend/
│   ├── api-gateway/         # Spring Cloud Gateway
│   ├── auth-service/        # Authentication
│   ├── movie-service/       # TMDB integration
│   └── user-service/        # User movie lists
│
├── docker-compose.yml
└── .github/workflows/       # CI/CD
```

## 🎨 Features

- ✅ Pinterest-style masonry grid
- ✅ Dark/Light theme toggle
- ✅ Real-time movie search with autocomplete
- ✅ Infinite scroll
- ✅ User authentication (Email + Google OAuth ready)
- ✅ Personal movie lists (Watched, Watchlist, Favorites)
- ✅ Cinematic UI with smooth animations
- ✅ Fully responsive design

## 🔑 Environment Variables

Create a `.env` file:

```env
# TMDB API
TMDB_API_KEY=your_tmdb_api_key

# JWT Secret (min 32 chars)
JWT_SECRET=cineior-secret-key-for-jwt-authentication-256-bits-long

# Database (Docker defaults)
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/cineior
SPRING_DATASOURCE_USERNAME=cineior
SPRING_DATASOURCE_PASSWORD=cineior123
```

## 📜 License

MIT
