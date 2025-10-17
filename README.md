# Dev Meme APi

A private API that manages a meme gallery SQL Database.

**Author**: Codex March 2025 cohort

**Live API:** [dev-meme-api.onrender.com](https://dev-meme-api.onrender.com/)

## How to run

Create `.env` file with contents from .env.example

`npm install`

`npm run dev`

## API Routes

- GET /memes
  - Returns an array of memes
- POST /memes
  - Add a meme to SQL library

## Tech Used

- Express.js
- AWS RDS
- Prisma
- Bcrypt
- Dotenv
- Joi
- Jsonwebtoken
