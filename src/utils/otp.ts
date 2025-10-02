import crypto from 'crypto';

export const generateOTP = (length: number = 6): string => {
    return crypto.randomBytes(length / 2).toString('hex').toUpperCase();
};

export const getOTPExpiry = (minutes: number = 10): Date => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    return now;
};