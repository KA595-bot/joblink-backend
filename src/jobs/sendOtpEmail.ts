import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,  // smtp.gmail.com
    port: Number(process.env.EMAIL_PORT),  // 587
    secure: process.env.EMAIL_SECURE === 'true',  // false for 587
    auth: {
        user: process.env.EMAIL_USER,  // Gmail address
        pass: process.env.EMAIL_PASS,  // App Password
    },
    // Optional: Add TLS options for better security
    tls: {
        rejectUnauthorized: false,  // For self-signed certs (not needed for Gmail)
    },
});