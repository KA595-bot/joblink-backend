import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '@/utils/token';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = verifyAccessToken(token);
        req.user = { id: decoded.userId, roles: decoded.roles }; // Attach decoded payload
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

export const authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        if (!roles.some(role => req.user!.roles.includes(role))) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        next();
    };
};