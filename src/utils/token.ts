import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { Role } from '@/generated/prisma';
import {prisma} from "@/config/database";
const REFRESH_TOKEN_EXPIRY_DAYS = 30;

export const generateAccessToken = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
    });
    if (!user) {
        throw new Error('User not found');
    }
    const payload = { userId, role: user.role || Role.USER };
    const secret = process.env.JWT_SECRET || 'your-secret';
    return jwt.sign(payload, secret, { expiresIn: '1h' });
};

export const verifyAccessToken = (token: string) => {
    const secret = process.env.JWT_SECRET || 'your-secret';
    return jwt.verify(token, secret) as { userId: string; role: Role | null };
};

export const generateRefreshToken = () => {
    return uuidv4();
};

export const getRefreshExpiry = () => {
    const now = new Date();
    now.setDate(now.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);
    return now;
};