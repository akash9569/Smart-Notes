import cron from 'node-cron';
import Task from '../models/Task.js';
import User from '../models/User.js';
import sendEmail from '../utils/email.js';
import getEmailTemplate from '../utils/emailTemplate.js';

const scheduleReminders = () => {
    // Run every minute
    cron.schedule('* * * * *', async () => {
        console.log('Running reminder check...');
        try {
            const now = new Date();
            // Find tasks with reminder due in the past (and not sent yet)
            // Or within a small window if we want to be precise. 
            // For simplicity, let's say reminder is due if it's <= now and reminderSent is false.
            // Also ensure task is not completed.
            const tasks = await Task.find({
                reminder: { $lte: now },
                reminderSent: false,
                completed: false
            }).populate('userId');

            console.log(`[Scheduler] Checked at ${now.toISOString()}. Found ${tasks.length} due tasks.`);

            for (const task of tasks) {
                const user = task.userId;
                if (!user || !user.email) continue;

                const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleString() : 'No due date';
                const htmlContent = getEmailTemplate(user.name, task.title, dueDate, task.description);

                try {
                    await sendEmail({
                        email: user.email,
                        subject: `Reminder: ${task.title}`,
                        html: htmlContent,
                    });

                    // Mark as sent
                    task.reminderSent = true;
                    await task.save();
                    console.log(`Email sent to ${user.email} for task ${task._id}`);
                } catch (emailError) {
                    console.error(`Failed to send email for task ${task._id}:`, emailError);
                }
            }
        } catch (error) {
            console.error('Error in reminder scheduler:', error);
        }
    });
};

export default scheduleReminders;
