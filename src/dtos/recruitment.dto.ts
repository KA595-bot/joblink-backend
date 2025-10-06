import { IsEmail, IsString, MinLength, IsNotEmpty, IsOptional } from 'class-validator';

export class RecruitmentDto {
    @IsString()
    @IsNotEmpty()
    userId: string

    @IsOptional()
    @IsString()
    companyName?: string

    @IsOptional()
    @IsString()
    description?: string
}