const jwt = require('jsonwebtoken');

const authMiddleware = {
    protect: async (request, response, next) => {
        try {
            let token = request.cookies?.jwtToken;

            if (!token && request.headers.authorization && request.headers.authorization.startsWith('Bearer')) {
                token = request.headers.authorization.split(' ')[1];
            }

            if (!token) {
                return response.status(401).json({
                    message: 'Unauthorized access, token missing'
                });
            }

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
                request.user = decoded;
                next();
            } catch (error) {
                return response.status(401).json({
                    message: 'Unauthorized access, token invalid or expired'
                });
            }

        } catch (error) {
            console.error('Auth middleware error:', error);
            return response.status(500).json({
                message: 'Internal server error'
            });
        }
    }
};

module.exports = authMiddleware;
