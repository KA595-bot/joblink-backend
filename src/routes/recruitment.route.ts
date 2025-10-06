import {Router} from 'express';
import {createRecruiter, validateRecruiter} from '@/controller/recruitment.controller';
import {authenticate, authorize, checkPermission} from '@/middlewares/auth.middleware';
import {Role} from '@/generated/prisma';

const router = Router();

router.post(
    '/create-recruiter',
    authenticate,
    authorize([Role.USER]),
    checkPermission('create_recruiter'),
    createRecruiter
);

router.put('/validate-recruiter',
    authenticate,
    authorize([Role.ADMIN]),
    checkPermission('update_recruiter'),
    validateRecruiter
);

export default router;