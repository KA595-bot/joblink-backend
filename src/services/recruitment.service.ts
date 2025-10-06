import { prisma } from '@/config/database';
import { RecruitmentDto } from '@/dtos/recruitment.dto';
import { Role } from '@/generated/prisma';

export class RecruitmentService {
    async createRecruiter(dto: RecruitmentDto) {
        const user = await prisma.user.findUnique({
            where: { id: dto.userId },
            select: { id: true, role: true, isRecruiter: true, isSpecialist: true },
        });
        if (!user) {
            throw new Error('User not found');
        }
        if (user.isRecruiter || user.role === Role.RECRUITER) {
            throw new Error('User is already a recruiter');
        }
        if (user.isSpecialist || user.role === Role.SPECIALIST) {
            throw new Error('Specialists cannot become recruiters');
        }

        const updatedUser = await prisma.user.update({
            where: { id: dto.userId },
            data: { isRecruiter: true, role: 'RECRUITER' },
        });

        const recruiter = await prisma.recruiter.create({
            data: {
                userId: dto.userId,
                companyName: dto.companyName || '',
                description: dto.description || '',
                isVerified: false,
            },
        });

        return { message: 'Successfully became a recruiter. You will receive an email soon for activation !!', recruiter };
    }

    async validateRecruiter(recruiterId: string) {
        const user = await prisma.user.findUnique({
            where: { id: recruiterId },
            select: { id: true, role: true, isRecruiter: true, isSpecialist: true },
        });
        if (!user) {
            throw new Error('User not found');
        }

        if (user.isSpecialist || user.role === Role.SPECIALIST) {
            throw new Error('Specialists cannot become recruiters');
        }

        const updatedUser = await prisma.recruiter.update({
            where: { id: recruiterId },
            data: { isVerified: true },
        });


    }
}