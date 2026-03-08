import { logoCid } from './logoBase64.js';

const getWelcomeTemplate = (name) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Smart Notes</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body {
            margin: 0;
            padding: 0;
            background-color: #FAFAFA;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
            color: #111827;
        }
        
        .container {
            width: 100%;
            max-width: 600px;
            margin: 40px auto;
            background-color: #FFFFFF;
            border: 1px solid #E5E7EB;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
        }
        
        .header-wrapper {
            padding: 40px 48px;
            background-color: #EEF8FA;
            text-align: center;
            border-bottom: 1px solid #E5E7EB;
        }
        
        .logo-container {
            display: inline-block;
            margin-bottom: 24px;
        }
        
        .logo-img {
            width: 64px;
            height: 64px;
            border-radius: 14px;
            display: block;
        }
        
        .welcome-title {
            margin: 0;
            font-size: 32px;
            font-weight: 800;
            color: #111827;
            letter-spacing: -0.025em;
            line-height: 1.2;
        }
        
        .welcome-subtitle {
            margin: 12px 0 0;
            font-size: 16px;
            color: #4B5563;
            font-weight: 500;
        }
        
        .body-content {
            padding: 48px;
        }
        
        .greeting {
            margin: 0 0 24px;
            font-size: 20px;
            font-weight: 600;
            color: #111827;
        }
        
        .intro-text {
            margin: 0 0 32px;
            font-size: 16px;
            line-height: 1.6;
            color: #374151;
        }
        
        .features-container {
            margin: 0 0 40px;
        }
        
        .feature-row {
            margin-bottom: 24px;
            display: block;
        }
        
        .feature-icon {
            font-size: 20px;
            margin-right: 12px;
            vertical-align: middle;
        }
        
        .feature-text-content {
            display: inline-block;
            vertical-align: middle;
            width: calc(100% - 40px);
        }
        
        .feature-title {
            margin: 0 0 4px;
            font-size: 16px;
            font-weight: 600;
            color: #111827;
        }
        
        .feature-desc {
            margin: 0;
            font-size: 14px;
            color: #6B7280;
            line-height: 1.5;
        }
        
        .cta-wrapper {
            text-align: center;
            margin-top: 48px;
        }
        
        .cta-button {
            display: inline-block;
            background-color: #111827;
            color: #ffffff !important;
            text-decoration: none;
            font-size: 16px;
            font-weight: 600;
            padding: 16px 36px;
            border-radius: 8px;
        }
        
        .footer {
            background-color: #F9FAFB;
            padding: 32px 48px;
            text-align: center;
            border-top: 1px solid #E5E7EB;
        }
        
        .footer p {
            margin: 0 0 16px;
            font-size: 14px;
            color: #6B7280;
            line-height: 1.5;
        }
        
        .footer a {
            color: #4F46E5;
            text-decoration: none;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header-wrapper">
            <div class="logo-container">
                <img src="cid:${logoCid}" alt="Smart Notes Logo" class="logo-img" />
            </div>
            <h1 class="welcome-title">Welcome to Smart Notes</h1>
            <p class="welcome-subtitle">The all-in-one workspace for your life's work.</p>
        </div>
        
        <div class="body-content">
            <h2 class="greeting">Hi ${name},</h2>
            <p class="intro-text">
                We're thrilled to have you on board! Smart Notes is designed to be the central hub for your productivity. Say goodbye to switching between multiple apps.
            </p>
            
            <div class="features-container">
                <div class="feature-row">
                    <span class="feature-icon">📝</span>
                    <div class="feature-text-content">
                        <div class="feature-title">Powerful Note-Taking</div>
                        <p class="feature-desc">Capture everything from quick thoughts to long-form documents with our rich editor.</p>
                    </div>
                </div>
                
                <div class="feature-row">
                    <span class="feature-icon">✅</span>
                    <div class="feature-text-content">
                        <div class="feature-title">Integrated Tasks</div>
                        <p class="feature-desc">Turn your notes directly into actionable tasks and track your progress effortlessly.</p>
                    </div>
                </div>
                
                <div class="feature-row">
                    <span class="feature-icon">📊</span>
                    <div class="feature-text-content">
                        <div class="feature-title">Life Management</div>
                        <p class="feature-desc">Keep your finances in check and build lasting habits side-by-side with your work.</p>
                    </div>
                </div>
            </div>
            
            <div class="cta-wrapper">
                <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard" class="cta-button">Go to your Dashboard</a>
            </div>
        </div>
        
        <div class="footer">
            <p>
                Have questions? Check out our <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/contact">Support Options</a> or reply to this email.
            </p>
            <p>
                &copy; ${new Date().getFullYear()} Smart Notes App. All rights reserved.<br>
                You are receiving this email because you signed up for a Smart Notes account.
            </p>
        </div>
    </div>
</body>
</html>
    `;
};

export default getWelcomeTemplate;
