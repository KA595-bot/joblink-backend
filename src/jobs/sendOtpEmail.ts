import { inngest } from '@/config/inngest';
import { transporter } from '@/config/email';

export const sendOtpEmail = inngest.createFunction(
    { id: 'send-otp-email' },
    { event: 'send.otp.email' },
    async ({ event }) => {
        const { email, otp } = event.data;

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Joblink OTP Verification',
            text: `<p>Your OTP code is ${otp}. It expires in 10 minutes.</p>`,
            html: `<p style="font-size: 16px; line-height: 1.5em; margin: 0;">Your OTP code is <strong>${otp}</strong>. It expires in 10 minutes.</p>`,
        });
    }
);