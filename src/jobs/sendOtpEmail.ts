import { inngest } from '@/config/inngest';
import { transporter } from '@/config/email';
export const sendOtpEmail = inngest.createFunction(
    { id: 'send-otp-email' }, // Unique ID for the function
    { event: 'send.otp.email' }, // Triggers on this event
    async ({ event }) => {
        const { email, otp } = event.data;

        await transporter.sendMail({
            from: process.env.EMAIL_FROM || 'noreply@joblink.com',
            to: email,
            subject: 'Joblink OTP Verification',
            text: `Your OTP code is ${otp}. It expires in 10 minutes.`,
            html: `<p>Your OTP code is <strong>${otp}</strong>. It expires in 10 minutes.</p>`,
        });

        console.log(`OTP email sent to ${email}`); // For debugging
    }
);