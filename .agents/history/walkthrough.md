# Walkthrough - Server Setup & Basic Express Server

## Summary of Work Done
- Established the core Node.js/Express project directory structure under `src/`:
  - `src/config/`
  - `src/controllers/`
  - `src/dao/`
  - `src/models/`
  - `src/routes/`
  - `src/services/`
  - `src/utils/`
- Created `server.js` with Express server listening on port 5001.
- Configured essential middlewares (`cors`, `express.json()`, `cookie-parser`).
- Added a basic health check endpoint at `GET /`.
- Configured `.env` file containing environment variable definitions (`PORT=5001`, `MONGODB_URI`, `JWT_SECRET`).
- Installed production dependencies (`express`, `cors`, `cookie-parser`, `dotenv`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `express-validator`) and dev dependencies (`nodemon`).
- Configured NPM scripts in `package.json` (`start` and `dev`).

## Verification
- Verified `GET /` endpoint using `Invoke-RestMethod`:
  - Status Code: `200 OK`
  - Response: `{ "message": "Server is up and running on port 5001" }`
- Verified server startup and clean execution.
