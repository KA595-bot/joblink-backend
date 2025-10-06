import { prisma } from '@/config/database';
import { RecruitmentDto } from '@/dtos/recruitment.dto';
import { Role } from '@/generated/prisma';
import { inngest } from '@/config/inngest';


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

        return { message: 'Successfully became a recruiter. You will receive an email soon for activation !!', recruiter, updatedUser };
    }

    async validateRecruiter(dto: RecruitmentDto) {
        const user = await prisma.user.findUnique({
            where: { id: dto.userId },
            select: { id: true, role: true, isRecruiter: true, isSpecialist: true, email: true },
        });
        if (!user) {
            throw new Error('User not found');
        }

        if (user.isSpecialist || user.role === Role.SPECIALIST) {
            throw new Error('Specialists cannot become recruiters');
        }

        const updatedUser = await prisma.recruiter.update({
            where: { userId: dto.userId },
            data: { isVerified: true },
        });


        await inngest.send({
            name: 'send.recruiter.email',
            data: { email: user.email },
        });

        return { message: "Successfully activated the recruiter's profile", updatedUser };

    }
}