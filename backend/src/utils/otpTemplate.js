import { logoCid } from './logoBase64.js';

const getOtpTemplate = (userName, otp) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset OTP</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; background-color: #FAFAFA;">
    <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: 40px auto; background-color: #09090b; color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.4); border: 1px solid #27272a;">
        <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 32px 24px; text-align: center;">
            <img src="cid:${logoCid}" alt="Smart Notes Logo" style="width: 56px; height: 56px; border-radius: 14px; display: block; margin: 0 auto 12px; background-color: white;" />
            <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">Smart Notes</h1>
        </div>
        
        <div style="padding: 40px 32px; background-color: #121214;">
            <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 600; color: #f4f4f5;">Password Reset Request</h2>
            <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #a1a1aa;">
                Hello ${userName || 'User'},<br><br>
                We received a request to reset your password for your Smart Notes account. Use the secure One-Time Password (OTP) below to proceed.
            </p>
            
            <div style="background-color: #09090b; border: 1px solid #27272a; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
                <p style="margin: 0 0 8px; font-size: 13px; font-weight: 600; text-transform: uppercase; color: #818cf8; letter-spacing: 1px;">Your Verification Code</p>
                <div style="font-size: 36px; font-weight: 800; color: #ffffff; letter-spacing: 6px; font-variant-numeric: tabular-nums;">${otp}</div>
            </div>
            
            <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.5; color: #71717a;">
                <strong style="color: #ef4444;">Note:</strong> This code is valid for exactly <strong>10 minutes</strong>. If you did not request a password reset, you can safely ignore this email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #27272a; margin: 32px 0;">
            
            <p style="margin: 0; font-size: 13px; color: #52525b; text-align: center;">
                If you're having trouble with the code above, contact our support team.<br>
                &copy; ${new Date().getFullYear()} Smart Notes App. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
    `;
};

export default getOtpTemplate;
