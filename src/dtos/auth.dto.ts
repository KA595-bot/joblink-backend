import { IsEmail, IsString, MinLength, IsNotEmpty, IsOptional } from 'class-validator';

export class SignupDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsString()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    // Add other optional fields as needed
}

export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;
}

export class VerifyOtpDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    code: string;
}

export class RefreshDto {
    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}