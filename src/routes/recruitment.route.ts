import { Router } from 'express';
import { createRecruiter } from '@/controller/recruitment.controller';
import { authenticate, authorize, checkPermission } from '@/middlewares/auth.middleware';
import { Role } from '@/generated/prisma';

const router = Router();

router.post(
    '/create-recruiter',
    authenticate,
    authorize([Role.USER]),
    checkPermission('create_recruiter'),
    createRecruiter
);

export default router;