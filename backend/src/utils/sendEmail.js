import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    // Create a transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: (process.env.EMAIL_PASSWORD || '').replace(/\s+/g, '') // strip spaces from Gmail app password
        }
    });

    // Define email options
    const mailOptions = {
        from: `Smart Notes <${process.env.EMAIL_USERNAME}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    };

    // Send the email
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to:', options.email);
    } catch (error) {
        console.error('Nodemailer Error:', error);
        throw error;
    }
};

export default sendEmail;
