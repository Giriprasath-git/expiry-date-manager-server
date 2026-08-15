const jwt = require('jsonwebtoken');

const authMiddleware = {
  protect: async (request, response, next) => {
    try {
      let token = request.cookies?.jwtToken;

      if (!token && request.headers.authorization && request.headers.authorization.startsWith('Bearer ')) {
        token = request.headers.authorization.split(' ')[1];
      }

      if (!token) {
        return response.status(401).json({
          message: 'Unauthorized access: No token provided'
        });
      }

      const jwtSecret = process.env.JWT_SECRET || 'default_secret';
      try {
        const decoded = jwt.verify(token, jwtSecret);
        request.user = decoded;
        next();
      } catch (error) {
        return response.status(401).json({
          message: 'Unauthorized access: Invalid or expired token'
        });
      }
    } catch (error) {
      console.error('Error in authMiddleware:', error);
      return response.status(500).json({
        message: 'Internal server error'
      });
    }
  }
};

module.exports = authMiddleware;
