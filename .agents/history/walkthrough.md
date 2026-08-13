# Walkthrough - Implementing Auth APIs - Login & Register

## Summary of Work Done
- **User Model**: Created [user.js](file:///d:/Projects/Expiry-Date-Manager/expiry-date-manager-server/src/models/user.js) Mongoose schema with `name`, `email` (unique, lowercase), `password`, and timestamps.
- **DAO Abstraction**: Created [userDao.js](file:///d:/Projects/Expiry-Date-Manager/expiry-date-manager-server/src/dao/userDao.js) implementing `findByEmail`, `createUser`, and `findById`.
- **Validators**: Added [authValidation.js](file:///d:/Projects/Expiry-Date-Manager/expiry-date-manager-server/src/utils/authValidation.js) containing `registerValidators` and `loginValidators` using `express-validator`.
- **Controller Logic**: Implemented [authController.js](file:///d:/Projects/Expiry-Date-Manager/expiry-date-manager-server/src/controllers/authController.js) with `register` and `login` handlers (password hashing via `bcryptjs`, JWT token generation, HTTP-only cookie setting).
- **Routes & Swagger Docs**: Created [authRoutes.js](file:///d:/Projects/Expiry-Date-Manager/expiry-date-manager-server/src/routes/authRoutes.js) with full OpenAPI annotations, configured [swagger.js](file:///d:/Projects/Expiry-Date-Manager/expiry-date-manager-server/src/config/swagger.js), and mounted `/auth` and `/api-docs` in [server.js](file:///d:/Projects/Expiry-Date-Manager/expiry-date-manager-server/server.js).

## Verification
- Verified Swagger UI endpoint `GET http://localhost:5001/api-docs/`.
- Verified server startup and routing structure without errors.
