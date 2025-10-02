import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY_DAYS = 30;

export const generateAccessToken = (userId: string, roles: string[]) => {
    return jwt.sign({ userId, roles }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET) as { userId: string; roles: string[] };
};

export const generateRefreshToken = () => {
    return uuidv4();
};

export const getRefreshExpiry = () => {
    const now = new Date();
    now.setDate(now.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);
    return now;
};