import { inngest } from '@/config/inngest';
import { transporter } from '@/config/email';

export const sendRecruiterEmail = inngest.createFunction(
    { id: 'send-recruiter-email' },
    { event: 'send.recruiter.email' },
    async ({ event }) => {
        const { email } = event.data;

        await transporter.sendMail({
            from: process.env.EMAIL_FROM || 'noreply@joblink.com',
            to: email,
            subject: 'Joblink Recruiter Activation',
            text: `Your recruiter account has been activated successfully !!.`,
            html: `<p>Your recruiter account has been activated. You can now create jobs and apply to them.</p>`,
        });

        console.log(`OTP email sent to ${email}`);
    }
);

