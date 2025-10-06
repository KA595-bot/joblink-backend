import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '@/utils/token';
import { Permissions } from '@/models/permission.model';
import { Role } from '@/generated/prisma';

export interface AuthRequest extends Request {
    user?: { id: string; role: Role | null };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = verifyAccessToken(token);
        req.user = { id: decoded.userId, role: decoded.role };
        console.log('Authenticated user:', req.user); // Debug log
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

export const authorize = (allowedRoles: Role[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        if (!req.user.role || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: `Forbidden: Role '${req.user.role}' not allowed` });
        }
        next();
    };
};

export const checkPermission = (permission: string) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const userRole = req.user.role || Role.USER;
        console.log(`Checking permission '${permission}' for role '${userRole}'`); // Debug log
        const permissions = new Permissions().getPermissionsByRoleName(userRole);
        console.log(`Available permissions for role '${userRole}':`, permissions); // Debug log
        if (permissions.includes(permission)) {
            next();
        } else {
            res.status(403).json({ error: `Access denied: Missing permission '${permission}'` });
        }
    };
};