import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RecruitmentDto } from '@/dtos/recruitment.dto';
import { getValidationErrorMessage } from "@/utils/validation";
import { RecruitmentService } from '@/services/recruitment.service';

const recruitmentService = new RecruitmentService();

export const createRecruiter = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dto = plainToInstance(RecruitmentDto, req.body);
        const errors = await validate(dto);
        if (errors.length > 0) {
            const errorMessage = getValidationErrorMessage(errors, false); // First error only
            return res.status(400).json({ error: errorMessage });
        }
        const result = await recruitmentService.createRecruiter(dto);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};


export const validateRecruiter = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dto = plainToInstance(RecruitmentDto, req.body);
        const errors = await validate(dto);
        if (errors.length > 0) {
            const errorMessage = getValidationErrorMessage(errors, false); // First error only
            return res.status(400).json({ error: errorMessage });
        }
        const result = await recruitmentService.validateRecruiter(dto);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};


