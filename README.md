# LetterBooks-API

REST API for a book review platform where users can create, read, and manage book reviews.

![Build and test](https://github.com/VeloraDev/LetterBooks-API/actions/workflows/build-and-test.yml/badge.svg)
![CodeQL](https://github.com/VeloraDev/LetterBooks-API/actions/workflows/codeql.yml/badge.svg)

## Technologies

- Node.js + Express — API development
- Prisma — database access and migrations
- PostgreSQL — relational database
- Docker — containerized environment

## Environment Variables

Create a `.env` file in the root of the project based on `.env.example`:

```bash
cp .env.example .env
```

## Run Locally

Using Docker Compose (recommended)

```bash
  git clone https://github.com/VeloraDev/LetterBooks-API
  cd LetterBooks-API
  docker compose up
```

Using npm (for development)

```bash
  git clone https://github.com/VeloraDev/LetterBooks-API
  cd LetterBooks-API
  npm install
  npx prisma migrate dev
  npm run start
```
