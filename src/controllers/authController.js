const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userDao = require('../dao/userDao');

const authController = {
    register: async (request, response) => {
        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(400).json({
                    errors: errors.array()
                });
            }

            const { name, email, password } = request.body;

            const existingUser = await userDao.findByEmail(email);
            if (existingUser) {
                return response.status(400).json({
                    message: 'User with this email already exists'
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = await userDao.createUser({
                name,
                email,
                password: hashedPassword
            });

            const jwtSecret = process.env.JWT_SECRET || 'default_secret';
            const token = jwt.sign(
                {
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email
                },
                jwtSecret,
                { expiresIn: '1h' }
            );

            response.cookie('jwtToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 3600000
            });

            return response.status(201).json({
                message: 'User registered successfully',
                user: {
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    createdAt: newUser.createdAt
                },
                token
            });

        } catch (error) {
            console.error('Error in register:', error);
            return response.status(500).json({
                message: 'Internal server error'
            });
        }
    },

    login: async (request, response) => {
        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(400).json({
                    errors: errors.array()
                });
            }

            const { email, password } = request.body;

            const user = await userDao.findByEmail(email);
            if (!user) {
                return response.status(400).json({
                    message: 'Invalid email or password'
                });
            }

            const isPasswordMatched = await bcrypt.compare(password, user.password);
            if (!isPasswordMatched) {
                return response.status(400).json({
                    message: 'Invalid email or password'
                });
            }

            const jwtSecret = process.env.JWT_SECRET || 'default_secret';
            const token = jwt.sign(
                {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                },
                jwtSecret,
                { expiresIn: '1h' }
            );

            response.cookie('jwtToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 3600000
            });

            return response.status(200).json({
                message: 'User authenticated successfully',
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.createdAt
                },
                token
            });

        } catch (error) {
            console.error('Error in login:', error);
            return response.status(500).json({
                message: 'Internal server error'
            });
        }
    }
};

module.exports = authController;
