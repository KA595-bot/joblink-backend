import { prisma } from '@/config/database';
import { generateAccessToken, generateRefreshToken, getRefreshExpiry } from '@/utils/token';
import { hashPassword, comparePassword } from '@/utils/hash';
import { generateOTP, getOTPExpiry } from '@/utils/otp';
import { inngest } from '@/config/inngest';
import { SignupDto, LoginDto, VerifyOtpDto, RefreshDto } from '@/dtos/auth.dto';
import { Role } from '@/generated/prisma';

export class AuthService {
    async signup(dto: SignupDto) {
        const existingUser = await prisma.user.findUnique({ where: { email: dto.email } });
        if (existingUser) {
            throw new Error('Email already in use');
        }

        const hashedPassword = await hashPassword(dto.password);
        const user = await prisma.user.create({
            data: {
                username: dto.username,
                email: dto.email,
                password: hashedPassword,
                firstName: dto.firstName,
                lastName: dto.lastName || '',
                name: `${dto.firstName || ''} ${dto.lastName || ''}`.trim(),
                status: 'INACTIVE',
                role: Role.USER,
            },
        });

        const otp = generateOTP();
        const expiry = getOTPExpiry();

        await prisma.otp.upsert({
            where: { userId: user.id },
            update: { code: otp, expirationAt: expiry },
            create: { userId: user.id, code: otp, expirationAt: expiry },
        });

        await inngest.send({
            name: 'send.otp.email',
            data: { email: user.email, otp },
        });

        return { message: 'Signup successful. OTP sent to email.' };
    }

    async verifyOtp(dto: VerifyOtpDto) {
        const user = await prisma.user.findUnique({ where: { email: dto.email } });
        if (!user) {
            throw new Error('User not found');
        }

        const otpRecord = await prisma.otp.findUnique({ where: { userId: user.id } });
        if (!otpRecord || otpRecord.code !== dto.code || otpRecord.expirationAt < new Date()) {
            throw new Error('Invalid or expired OTP');
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                isEmailVerified: true,
                emailVerifiedAt: new Date(),
                status: 'ACTIVE',
            },
        });

        await prisma.otp.delete({ where: { userId: user.id } });

        return { message: 'Account activated successfully' };
    }

    async login(dto: LoginDto) {
        const user = await prisma.user.findUnique({
            where: { email: dto.email },
            select: { id: true, email: true, password: true, status: true, role: true },
        });
        if (!user || user.status !== 'ACTIVE') {
            throw new Error('Invalid credentials or inactive account');
        }

        const isValid = await comparePassword(dto.password, user.password);
        if (!isValid) {
            throw new Error('Invalid credentials');
        }

        const accessToken = await generateAccessToken(user.id);
        const refreshToken = generateRefreshToken();
        const expiresAt = getRefreshExpiry();

        await prisma.session.create({
            data: {
                userId: user.id,
                token: refreshToken,
                expiresAt,
            },
        });

        return { accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role } };
    }

    async refresh(dto: RefreshDto) {
        const session = await prisma.session.findUnique({ where: { token: dto.refreshToken } });
        if (!session || session.expiresAt < new Date()) {
            throw new Error('Invalid or expired refresh token');
        }

        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { id: true, email: true, status: true, role: true },
        });
        if (!user || user.status !== 'ACTIVE') {
            throw new Error('User not found or inactive');
        }

        const accessToken = await generateAccessToken(user.id);

        return { accessToken, user: { id: user.id, email: user.email, role: user.role } };
    }

    async logout(refreshToken: string) {
        await prisma.session.deleteMany({ where: { token: refreshToken } });
        return { message: 'Logged out successfully' };
    }
}