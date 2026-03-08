import nodemailer from 'nodemailer';

// Create a reusable transporter using Gmail credentials from .env
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD, // This should be a Gmail App Password
        },
    });
};

export const sendContactEmail = async (req, res) => {
    const { name, email, phone, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: 'Name, email, and message are required.',
        });
    }

    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Smart Notes Contact Form" <${process.env.EMAIL_USERNAME}>`,
            to: process.env.EMAIL_USERNAME, // Send to smartnotes95@gmail.com
            replyTo: email, // So you can reply directly to the user
            subject: `New Contact Form Submission from ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1a1f2e; color: #e2e8f0; padding: 30px; border-radius: 12px; border: 1px solid #2d3748;">
                    <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 20px; border-radius: 8px; margin-bottom: 24px; text-align: center;">
                        <h1 style="margin: 0; color: white; font-size: 22px;">📬 New Contact Message</h1>
                        <p style="margin: 6px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">Smart Notes App</p>
                    </div>

                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #2d3748;">
                                <span style="color: #a0aec0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Name</span><br/>
                                <strong style="color: #fff; font-size: 16px;">${name}</strong>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #2d3748;">
                                <span style="color: #a0aec0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Email</span><br/>
                                <a href="mailto:${email}" style="color: #6366f1; font-size: 16px;">${email}</a>
                            </td>
                        </tr>
                        ${phone ? `
                        <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #2d3748;">
                                <span style="color: #a0aec0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Phone</span><br/>
                                <strong style="color: #fff; font-size: 16px;">${phone}</strong>
                            </td>
                        </tr>
                        ` : ''}
                        <tr>
                            <td style="padding: 12px 0;">
                                <span style="color: #a0aec0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Message</span><br/>
                                <p style="color: #e2e8f0; font-size: 15px; margin: 8px 0 0; line-height: 1.6; background: #0d1117; padding: 16px; border-radius: 8px; border: 1px solid #2d3748;">${message.replace(/\n/g, '<br/>')}</p>
                            </td>
                        </tr>
                    </table>

                    <p style="color: #718096; font-size: 12px; margin-top: 24px; text-align: center;">
                        This email was sent from the Smart Notes contact form at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST.
                    </p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: 'Your message has been sent successfully!',
        });
    } catch (error) {
        console.error('Error sending contact email:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again later.',
        });
    }
};
