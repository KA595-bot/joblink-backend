import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AuthService } from '@/services/auth.service';
import { SignupDto, LoginDto, VerifyOtpDto, RefreshDto } from '@/dtos/auth.dto';

const authService = new AuthService();

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dto = plainToInstance(SignupDto, req.body);
        const errors = await validate(dto);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }
        const result = await authService.signup(dto);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dto = plainToInstance(VerifyOtpDto, req.body);
        const errors = await validate(dto);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }
        const result = await authService.verifyOtp(dto);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dto = plainToInstance(LoginDto, req.body);
        const errors = await validate(dto);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }
        const result = await authService.login(dto);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dto = plainToInstance(RefreshDto, req.body);
        const errors = await validate(dto);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }
        const result = await authService.refresh(dto);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ error: 'Refresh token required' });
        }
        const result = await authService.logout(refreshToken);
        res.json(result);
    } catch (error) {
        next(error);
    }
};