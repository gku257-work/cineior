#!/bin/bash

# Cineior - Start Script
echo "🎬 Starting Cineior..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Error: Docker daemon is not running. Please start Docker Desktop first."
  exit 1
fi

# Determine the directory of the script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

# Check for .env file
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from example..."
    cp .env.example .env
fi

echo "🚀 Launching all services (Postgres, Gateway, Auth, Movie, User, Frontend)..."
docker compose up -d --build

echo "✅ Cineior is running!"
echo "------------------------------------------------"
echo "🌐 Frontend: http://localhost:3000"
echo "🛡️  Gateway:  http://localhost:8080"
echo "------------------------------------------------"
echo "To see logs, run: docker compose logs -f"
echo "To stop, run: docker compose down"
