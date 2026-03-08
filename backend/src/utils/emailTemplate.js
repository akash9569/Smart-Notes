import { logoCid } from './logoBase64.js';

const getEmailTemplate = (userName, taskTitle, dueDate, description) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task Reminder</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .content {
            padding: 30px;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #1f2937;
        }
        .task-card {
            background-color: #f8fafc;
            border-left: 4px solid #3B82F6;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .task-title {
            font-size: 20px;
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 10px;
            display: block;
        }
        .task-meta {
            color: #64748b;
            font-size: 14px;
            margin-bottom: 5px;
        }
        .task-description {
            margin-top: 15px;
            color: #475569;
            font-style: italic;
        }
        .button-container {
            text-align: center;
            margin-top: 30px;
        }
        .button {
            display: inline-block;
            background-color: #3B82F6;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            transition: background-color 0.3s;
        }
        .button:hover {
            background-color: #2563EB;
        }
        .footer {
            background-color: #f8fafc;
            padding: 20px;
            text-align: center;
            color: #94a3b8;
            font-size: 12px;
            border-top: 1px solid #e2e8f0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="cid:${logoCid}" alt="Smart Notes Logo" style="width: 56px; height: 56px; border-radius: 14px; display: block; margin: 0 auto 12px;" />
            <h1>Smart Notes Reminder</h1>
        </div>
        <div class="content">
            <div class="greeting">Hello ${userName},</div>
            <p>You have a task that is due soon. Here are the details:</p>
            
            <div class="task-card">
                <span class="task-title">${taskTitle}</span>
                <div class="task-meta">📅 Due: ${dueDate}</div>
                ${description ? `<div class="task-description">"${description}"</div>` : ''}
            </div>

            <div class="button-container">
                <a href="http://localhost:5173" class="button">View Task in App</a>
            </div>
        </div>
        <div class="footer">
            <p>This is an automated reminder from Smart Notes App.</p>
            <p>&copy; ${new Date().getFullYear()} Smart Notes. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `;
};

export default getEmailTemplate;
