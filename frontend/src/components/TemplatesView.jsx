import React, { useState } from 'react';
import {
    BookOpen,
    GraduationCap,
    Users,
    CheckSquare,
    Briefcase,
    Plus,
    Search,
    Layout,
    Calendar,
    FileText,
    Target,
    Coffee,
    Lightbulb,
    Heart,
    PenTool,
    Dumbbell,
    Plane,
    Utensils,
    Rocket,
    BrainCircuit,
    Sparkles,
    ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const categories = [
    { id: 'all', label: 'All', icon: Layout },
    { id: 'work', label: 'Work', icon: Briefcase },
    { id: 'personal', label: 'Personal', icon: Heart },
    { id: 'study', label: 'Study', icon: GraduationCap },
    { id: 'planning', label: 'Planning', icon: Calendar },
    { id: 'creative', label: 'Creative', icon: PenTool },
    { id: 'lifestyle', label: 'Lifestyle', icon: Coffee },
    { id: 'productivity', label: 'Productivity', icon: Rocket },
];

const templates = [
    {
        id: 'meeting-notes',
        title: 'Meeting Notes',
        description: 'Capture agenda, attendees, and action items efficiently.',
        icon: Users,
        category: 'work',
        accent: 'blue',
        featured: true,
        content: `
            <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 0 auto; color: #334155;">
                <div style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding: 32px; border-radius: 16px; color: white; margin-bottom: 32px; box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.2);">
                    <h1 style="margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.025em;">👥 Meeting Notes</h1>
                    <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 18px; font-weight: 500;">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>

                <div style="background: #eff6ff; border: 1px solid #dbeafe; border-radius: 16px; padding: 24px; margin-bottom: 32px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div>
                        <p style="margin: 0 0 4px 0; color: #1e40af; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Time</p>
                        <p style="margin: 0; color: #1e3a8a; font-weight: 500;">—</p>
                    </div>
                    <div>
                        <p style="margin: 0 0 4px 0; color: #1e40af; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Location</p>
                        <p style="margin: 0; color: #1e3a8a; font-weight: 500;">—</p>
                    </div>
                    <div style="grid-column: span 2;">
                        <p style="margin: 0 0 4px 0; color: #1e40af; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Attendees</p>
                        <p style="margin: 0; color: #1e3a8a; font-weight: 500;">—</p>
                    </div>
                </div>

                <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                    <h3 style="margin: 0 0 20px 0; color: #1e3a8a; font-size: 20px; font-weight: 700; display: flex; items-center; gap: 10px;">
                        <span style="background: #eff6ff; padding: 6px; border-radius: 8px; color: #2563eb;">📋</span>
                        Agenda
                    </h3>
                    <ul style="padding-left: 24px; margin: 0; color: #334155; font-size: 16px;">
                        <li style="margin-bottom: 12px; padding-left: 8px;"></li>
                        <li style="margin-bottom: 12px; padding-left: 8px;"></li>
                        <li style="margin-bottom: 12px; padding-left: 8px;"></li>
                    </ul>
                </div>

                <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                    <h3 style="margin: 0 0 20px 0; color: #1e3a8a; font-size: 20px; font-weight: 700; display: flex; items-center; gap: 10px;">
                        <span style="background: #eff6ff; padding: 6px; border-radius: 8px; color: #2563eb;">💬</span>
                        Discussion Notes
                    </h3>
                    <p style="color: #64748b; font-style: italic; margin: 0 0 16px 0;">Key points discussed...</p>
                    <ul style="padding-left: 24px; margin: 0; color: #334155; font-size: 16px;">
                        <li style="margin-bottom: 12px; padding-left: 8px;"></li>
                    </ul>
                </div>

                <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 16px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                    <h3 style="margin: 0 0 20px 0; color: #0c4a6e; font-size: 20px; font-weight: 700; display: flex; items-center; gap: 10px;">
                        <span style="background: #fff; padding: 6px; border-radius: 8px; color: #0284c7; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">✅</span>
                        Action Items
                    </h3>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        <li style="margin-bottom: 12px; display: flex; align-items: flex-start; gap: 12px;">
                            <input type="checkbox" style="width: 18px; height: 18px; border-radius: 6px; border: 2px solid #cbd5e1; margin-top: 3px; cursor: pointer;">
                            <div style="flex: 1;">
                                <span style="font-weight: 600; color: #0369a1; background: #e0f2fe; padding: 2px 6px; border-radius: 4px; font-size: 12px; margin-right: 8px;">OWNER</span>
                                <span style="border-bottom: 1px dashed #bae6fd; padding-bottom: 2px; color: #0c4a6e;">Task description...</span>
                            </div>
                        </li>
                        <li style="margin-bottom: 12px; display: flex; align-items: flex-start; gap: 12px;">
                            <input type="checkbox" style="width: 18px; height: 18px; border-radius: 6px; border: 2px solid #cbd5e1; margin-top: 3px; cursor: pointer;">
                            <div style="flex: 1;">
                                <span style="font-weight: 600; color: #94a3b8; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 12px; margin-right: 8px;">UNASSIGNED</span>
                                <span style="border-bottom: 1px dashed #bae6fd; padding-bottom: 2px; color: #0c4a6e;"></span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        `
    },
    {
        id: 'project-docs',
        title: 'Project Brief',
        description: 'Define project scope, goals, and timeline clearly.',
        icon: Briefcase,
        category: 'work',
        accent: 'indigo',
        content: `
            <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 0 auto; color: #334155;">
                <div style="background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%); padding: 32px; border-radius: 16px; color: white; margin-bottom: 32px; box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.2);">
                    <h1 style="margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.025em;">🚀 Project Brief</h1>
                    <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 18px; font-weight: 500;">Define scope, goals, and timeline.</p>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
                    <div style="background: #eef2ff; border: 1px solid #e0e7ff; border-radius: 16px; padding: 24px;">
                        <p style="margin: 0 0 4px 0; color: #4338ca; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Project Name</p>
                        <p style="margin: 0; color: #312e81; font-weight: 600; font-size: 18px;">[Insert Name]</p>
                    </div>
                    <div style="background: #eef2ff; border: 1px solid #e0e7ff; border-radius: 16px; padding: 24px;">
                        <p style="margin: 0 0 4px 0; color: #4338ca; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Status</p>
                        <span style="display: inline-block; background: #c7d2fe; color: #312e81; padding: 4px 12px; border-radius: 999px; font-size: 14px; font-weight: 600;">Planning</span>
                    </div>
                </div>

                <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                    <h3 style="margin: 0 0 16px 0; color: #312e81; font-size: 20px; font-weight: 700; display: flex; items-center; gap: 10px;">
                        <span style="background: #eef2ff; padding: 6px; border-radius: 8px; color: #4f46e5;">🎯</span>
                        Overview
                    </h3>
                    <p style="color: #475569; line-height: 1.6; margin: 0;">Brief description of the project purpose and vision.</p>
                </div>

                <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                    <h3 style="margin: 0 0 16px 0; color: #312e81; font-size: 20px; font-weight: 700; display: flex; items-center; gap: 10px;">
                        <span style="background: #eef2ff; padding: 6px; border-radius: 8px; color: #4f46e5;">🥅</span>
                        Goals & Objectives
                    </h3>
                    <ul style="padding-left: 24px; margin: 0; color: #334155; font-size: 16px; line-height: 1.6;">
                        <li style="margin-bottom: 8px;"><strong>Goal 1:</strong> Description...</li>
                        <li style="margin-bottom: 8px;"><strong>Goal 2:</strong> Description...</li>
                    </ul>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
                    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 16px; padding: 24px;">
                        <h3 style="margin: 0 0 16px 0; color: #166534; font-size: 18px; font-weight: 700; display: flex; items-center; gap: 8px;">
                            <span style="background: #fff; padding: 4px; border-radius: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">✅</span>
                            In Scope
                        </h3>
                        <ul style="padding-left: 20px; margin: 0; color: #15803d;">
                            <li style="margin-bottom: 8px;">Feature A</li>
                            <li style="margin-bottom: 8px;">Feature B</li>
                        </ul>
                    </div>
                    <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 16px; padding: 24px;">
                        <h3 style="margin: 0 0 16px 0; color: #991b1b; font-size: 18px; font-weight: 700; display: flex; items-center; gap: 8px;">
                            <span style="background: #fff; padding: 4px; border-radius: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">❌</span>
                            Out of Scope
                        </h3>
                        <ul style="padding-left: 20px; margin: 0; color: #b91c1c;">
                            <li style="margin-bottom: 8px;">Feature X</li>
                            <li style="margin-bottom: 8px;">Feature Y</li>
                        </ul>
                    </div>
                </div>

                <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                    <h3 style="margin: 0 0 20px 0; color: #312e81; font-size: 20px; font-weight: 700; display: flex; items-center; gap: 10px;">
                        <span style="background: #eef2ff; padding: 6px; border-radius: 8px; color: #4f46e5;">📅</span>
                        Timeline
                    </h3>
                    <table style="width: 100%; border-collapse: separate; border-spacing: 0;">
                        <thead>
                            <tr style="background: #f8fafc;">
                                <th style="text-align: left; padding: 12px 16px; border-top-left-radius: 8px; border-bottom: 2px solid #e2e8f0; color: #64748b; font-size: 14px; font-weight: 600;">Milestone</th>
                                <th style="text-align: left; padding: 12px 16px; border-bottom: 2px solid #e2e8f0; color: #64748b; font-size: 14px; font-weight: 600;">Date</th>
                                <th style="text-align: left; padding: 12px 16px; border-top-right-radius: 8px; border-bottom: 2px solid #e2e8f0; color: #64748b; font-size: 14px; font-weight: 600;">Owner</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="padding: 16px; border-bottom: 1px solid #f1f5f9; font-weight: 500;">Kickoff</td>
                                <td style="padding: 16px; border-bottom: 1px solid #f1f5f9;"></td>
                                <td style="padding: 16px; border-bottom: 1px solid #f1f5f9;"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `
    },
    {
        id: 'journal',
        title: 'Daily Journal',
        description: 'Reflect on your day, mood, and gratitude.',
        icon: BookOpen,
        category: 'personal',
        accent: 'pink',
        featured: true,
        content: `
            <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 0 auto; color: #334155;">
                <div style="background: linear-gradient(135deg, #ec4899 0%, #be185d 100%); padding: 32px; border-radius: 16px; color: white; margin-bottom: 32px; box-shadow: 0 10px 15px -3px rgba(236, 72, 153, 0.2);">
                    <h1 style="margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.025em;">🌸 Daily Journal</h1>
                    <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 18px; font-weight: 500;">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                
                <div style="background: #fdf2f8; border: 1px solid #fce7f3; border-radius: 16px; padding: 24px; margin-bottom: 32px; text-align: center;">
                    <h3 style="margin: 0 0 16px 0; color: #be185d; font-size: 18px; font-weight: 700;">🌤️ Mood Check-in</h3>
                    <div style="display: flex; justify-content: center; gap: 24px; font-size: 32px;">
                        <span style="cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">😄</span>
                        <span style="cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">🙂</span>
                        <span style="cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">😐</span>
                        <span style="cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">😔</span>
                        <span style="cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">😫</span>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
                    <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                        <h3 style="margin: 0 0 16px 0; color: #059669; font-size: 18px; font-weight: 700; display: flex; items-center; gap: 8px;">
                            <span style="background: #ecfdf5; padding: 4px; border-radius: 6px;">🙏</span>
                            Gratitude
                        </h3>
                        <ol style="padding-left: 20px; margin: 0; color: #047857;">
                            <li style="margin-bottom: 12px;"></li>
                            <li style="margin-bottom: 12px;"></li>
                            <li style="margin-bottom: 12px;"></li>
                        </ol>
                    </div>
                    <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                        <h3 style="margin: 0 0 16px 0; color: #d97706; font-size: 18px; font-weight: 700; display: flex; items-center; gap: 8px;">
                            <span style="background: #fffbeb; padding: 4px; border-radius: 6px;">🔥</span>
                            Priorities
                        </h3>
                        <ol style="padding-left: 20px; margin: 0; color: #b45309;">
                            <li style="margin-bottom: 12px;"></li>
                            <li style="margin-bottom: 12px;"></li>
                            <li style="margin-bottom: 12px;"></li>
                        </ol>
                    </div>
                </div>

                <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                    <h3 style="margin: 0 0 16px 0; color: #4f46e5; font-size: 20px; font-weight: 700; display: flex; items-center; gap: 10px;">
                        <span style="background: #eef2ff; padding: 6px; border-radius: 8px; color: #4f46e5;">🧠</span>
                        Brain Dump
                    </h3>
                    <p style="color: #64748b; font-style: italic; margin: 0;">Clear your mind...</p>
                    <p><br><br></p>
                </div>

                <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                    <h3 style="margin: 0 0 16px 0; color: #4f46e5; font-size: 20px; font-weight: 700; display: flex; items-center; gap: 10px;">
                        <span style="background: #eef2ff; padding: 6px; border-radius: 8px; color: #4f46e5;">📝</span>
                        Daily Reflection
                    </h3>
                    <p style="margin: 0 0 8px 0; font-weight: 600; color: #334155;">What went well today?</p>
                    <p style="margin-bottom: 24px;"><br></p>
                    <p style="margin: 0 0 8px 0; font-weight: 600; color: #334155;">What could have gone better?</p>
                    <p><br></p>
                </div>

                <div style="background: #eff6ff; border: 1px solid #dbeafe; border-radius: 16px; padding: 24px;">
                    <h3 style="margin: 0 0 12px 0; color: #1d4ed8; font-size: 18px; font-weight: 700; display: flex; items-center; gap: 8px;">
                        <span style="background: #fff; padding: 4px; border-radius: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">🚀</span>
                        Tomorrow's Plan
                    </h3>
                    <p style="color: #1e40af; font-style: italic; margin: 0 0 8px 0;">One thing I'm looking forward to:</p>
                    <p></p>
                </div>
            </div>
        `
    },
    {
        id: 'habit-tracker',
        title: 'Habit Tracker',
        description: 'Track daily habits and build consistency.',
        icon: CheckSquare,
        category: 'personal',
        accent: 'green',
        content: `
    <div style="font-family: sans-serif; max-width: 800px; margin: 0 auto;">
                <h1 style="color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 10px;">✅ Weekly Habit Tracker</h1>
                <p style="color: #666;"><strong>Week of:</strong> ${new Date().toLocaleDateString()}</p>

                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <thead>
                        <tr style="background-color: #dcfce7;">
                            <th style="padding: 10px; border: 1px solid #86efac; text-align: left;">Habit</th>
                            <th style="padding: 10px; border: 1px solid #86efac; width: 40px;">M</th>
                            <th style="padding: 10px; border: 1px solid #86efac; width: 40px;">T</th>
                            <th style="padding: 10px; border: 1px solid #86efac; width: 40px;">W</th>
                            <th style="padding: 10px; border: 1px solid #86efac; width: 40px;">T</th>
                            <th style="padding: 10px; border: 1px solid #86efac; width: 40px;">F</th>
                            <th style="padding: 10px; border: 1px solid #86efac; width: 40px;">S</th>
                            <th style="padding: 10px; border: 1px solid #86efac; width: 40px;">S</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #bbf7d0;">💧 Drink 2L Water</td>
                            <td style="border: 1px solid #bbf7d0; text-align: center;"><input type="checkbox"></td>
                            <td style="border: 1px solid #bbf7d0; text-align: center;"><input type="checkbox"></td>
                            <td style="border: 1px solid #bbf7d0; text-align: center;"><input type="checkbox"></td>
                            <td style="border: 1px solid #bbf7d0; text-align: center;"><input type="checkbox"></td>
                            <td style="border: 1px solid #bbf7d0; text-align: center;"><input type="checkbox"></td>
                            <td style="border: 1px solid #bbf7d0; text-align: center;"><input type="checkbox"></td>
                            <td style="border: 1px solid #bbf7d0; text-align: center;"><input type="checkbox"></td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #bbf7d0;">📖 Read 30 mins</td>
                            <td style="border: 1px solid #bbf7d0; text-align: center;"><input type="checkbox"></td>
                            <td style="border: 1px solid #bbf7d0; text-align: center;"><input type="checkbox"></td>
                            <td style="border: 1px solid #bbf7d0; text-align: center;"><input type="checkbox"></td>
                            <td style="border: 1px solid #bbf7d0; text-align: center;"><input type="checkbox"></td>
                            <td style="border: 1px solid #bbf7d0; text-align: center;"><input type="checkbox"></td>
                            <td style="border: 1px solid #bbf7d0; text-align: center;"><input type="checkbox"></td>
                            <td style="border: 1px solid #bbf7d0; text-align: center;"><input type="checkbox"></td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #bbf7d0;">🏃‍♂️ Exercise</td>
                            <td style="border: 1px solid #bbf7d0; text-align: center;"><input type="checkbox"></td>
                            <td style="border: 1px solid #bbf7d0; text-align: center;"><input type="checkbox"></td>
                            <td style="border: 1px solid #bbf7d0; text-align: center;"><input type="checkbox"></td>
                            <td style="border: 1px solid #bbf7d0; text-align: center;"><input type="checkbox"></td>
                            <td style="border: 1px solid #bbf7d0; text-align: center;"><input type="checkbox"></td>
                            <td style="border: 1px solid #bbf7d0; text-align: center;"><input type="checkbox"></td>
                            <td style="border: 1px solid #bbf7d0; text-align: center;"><input type="checkbox"></td>
                        </tr>
                    </tbody>
                </table>

                <h3 style="color: #15803d; margin-top: 25px;">📝 Weekly Reflection</h3>
                <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px;">
                    <p>What went well this week?</p>
                    <br>
                </div>
            </div >
    `
    },
    {
        id: 'class-notes',
        title: 'Lecture Notes',
        description: 'Organize key concepts and summaries from classes.',
        icon: GraduationCap,
        category: 'study',
        accent: 'orange',
        content: `
    <div style="font-family: sans-serif; max-width: 800px; margin: 0 auto;">
                <h1 style="color: #f97316; border-bottom: 2px solid #f97316; padding-bottom: 10px;">🎓 Lecture Notes</h1>
                
                <div style="background-color: #fff7ed; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #f97316;">
                    <p style="margin: 5px 0;"><strong>📚 Subject:</strong> </p>
                    <p style="margin: 5px 0;"><strong>📌 Topic:</strong> </p>
                    <p style="margin: 5px 0;"><strong>📅 Date:</strong> ${new Date().toLocaleDateString()}</p>
                </div>

                <h3 style="color: #c2410c; background-color: #ffedd5; padding: 8px; border-radius: 4px;">🔑 Key Concepts</h3>
                <ul>
                    <li></li>
                    <li></li>
                </ul>

                <h3 style="color: #c2410c; background-color: #ffedd5; padding: 8px; border-radius: 4px; margin-top: 20px;">📝 Detailed Notes</h3>
                <p>Start typing here...</p>
                <p><br></p>

                <h3 style="color: #c2410c; background-color: #ffedd5; padding: 8px; border-radius: 4px; margin-top: 20px;">💡 Summary</h3>
                <div style="border: 1px dashed #fdba74; padding: 10px; border-radius: 6px;">
                    <p>Brief summary of the lecture...</p>
                </div>
            </div>
    `
    },
    {
        id: 'study-plan',
        title: 'Study Plan',
        description: 'Map out your study schedule and objectives.',
        icon: Lightbulb,
        category: 'study',
        accent: 'yellow',
        content: `
    <div style="font-family: sans-serif; max-width: 800px; margin: 0 auto;">
                <h1 style="color: #eab308; border-bottom: 2px solid #eab308; padding-bottom: 10px;">📚 Study Plan</h1>
                
                <div style="background-color: #fefce8; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #eab308;">
                    <p style="margin: 5px 0;"><strong>🎯 Main Goal:</strong> </p>
                    <p style="margin: 5px 0;"><strong>📅 Timeline:</strong> </p>
                </div>

                <h3 style="color: #a16207; background-color: #fef9c3; padding: 8px; border-radius: 4px;">🗓️ Weekly Schedule</h3>
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #fde047; font-weight: bold;">Monday</td>
                        <td style="padding: 8px; border-bottom: 1px solid #fde047;"></td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #fde047; font-weight: bold;">Tuesday</td>
                        <td style="padding: 8px; border-bottom: 1px solid #fde047;"></td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #fde047; font-weight: bold;">Wednesday</td>
                        <td style="padding: 8px; border-bottom: 1px solid #fde047;"></td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #fde047; font-weight: bold;">Thursday</td>
                        <td style="padding: 8px; border-bottom: 1px solid #fde047;"></td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #fde047; font-weight: bold;">Friday</td>
                        <td style="padding: 8px; border-bottom: 1px solid #fde047;"></td>
                    </tr>
                </table>

                <h3 style="color: #a16207; background-color: #fef9c3; padding: 8px; border-radius: 4px; margin-top: 20px;">🧠 Topics to Master</h3>
                <ul style="list-style-type: none; padding-left: 0;">
                    <li style="margin-bottom: 5px;"><input type="checkbox"> </li>
                    <li style="margin-bottom: 5px;"><input type="checkbox"> </li>
                </ul>
            </div>
    `
    },
    {
        id: 'daily-planner',
        title: 'Daily Planner',
        description: 'Structure your day with priorities and time blocks.',
        icon: Calendar,
        category: 'planning',
        accent: 'teal',
        featured: true,
        content: `
            <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 0 auto; color: #334155;">
                <div style="background: linear-gradient(135deg, #0d9488 0%, #115e59 100%); padding: 32px; border-radius: 16px; color: white; margin-bottom: 32px; box-shadow: 0 10px 15px -3px rgba(13, 148, 136, 0.2);">
                    <h1 style="margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.025em;">🗓️ Daily Planner</h1>
                    <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 18px; font-weight: 500;">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
                    <div style="background: #f0fdfa; border: 1px solid #ccfbf1; border-radius: 16px; padding: 24px;">
                        <h3 style="margin: 0 0 20px 0; color: #0f766e; font-size: 20px; font-weight: 700; display: flex; items-center; gap: 10px;">
                            <span style="background: #fff; padding: 6px; border-radius: 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); font-size: 16px;">🔥</span> 
                            Top Priorities
                        </h3>
                        <ol style="padding-left: 24px; margin: 0; color: #115e59; font-size: 16px;">
                            <li style="margin-bottom: 16px; font-weight: 600; padding-left: 8px;"></li>
                            <li style="margin-bottom: 16px; padding-left: 8px;"></li>
                            <li style="margin-bottom: 16px; padding-left: 8px;"></li>
                        </ol>
                    </div>
                    
                    <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                        <h3 style="margin: 0 0 20px 0; color: #334155; font-size: 20px; font-weight: 700; display: flex; items-center; gap: 10px;">
                            <span style="background: #f1f5f9; padding: 6px; border-radius: 8px; font-size: 16px;">📝</span>
                            To-Do List
                        </h3>
                        <ul style="list-style: none; padding: 0; margin: 0;">
                            <li style="margin-bottom: 12px; display: flex; align-items: flex-start; gap: 12px;">
                                <input type="checkbox" style="width: 18px; height: 18px; border-radius: 6px; border: 2px solid #cbd5e1; margin-top: 3px; cursor: pointer;">
                                <span style="flex: 1; border-bottom: 1px dashed #e2e8f0; padding-bottom: 2px;"></span>
                            </li>
                            <li style="margin-bottom: 12px; display: flex; align-items: flex-start; gap: 12px;">
                                <input type="checkbox" style="width: 18px; height: 18px; border-radius: 6px; border: 2px solid #cbd5e1; margin-top: 3px; cursor: pointer;">
                                <span style="flex: 1; border-bottom: 1px dashed #e2e8f0; padding-bottom: 2px;"></span>
                            </li>
                            <li style="margin-bottom: 12px; display: flex; align-items: flex-start; gap: 12px;">
                                <input type="checkbox" style="width: 18px; height: 18px; border-radius: 6px; border: 2px solid #cbd5e1; margin-top: 3px; cursor: pointer;">
                                <span style="flex: 1; border-bottom: 1px dashed #e2e8f0; padding-bottom: 2px;"></span>
                            </li>
                            <li style="margin-bottom: 12px; display: flex; align-items: flex-start; gap: 12px;">
                                <input type="checkbox" style="width: 18px; height: 18px; border-radius: 6px; border: 2px solid #cbd5e1; margin-top: 3px; cursor: pointer;">
                                <span style="flex: 1; border-bottom: 1px dashed #e2e8f0; padding-bottom: 2px;"></span>
                            </li>
                            <li style="margin-bottom: 12px; display: flex; align-items: flex-start; gap: 12px;">
                                <input type="checkbox" style="width: 18px; height: 18px; border-radius: 6px; border: 2px solid #cbd5e1; margin-top: 3px; cursor: pointer;">
                                <span style="flex: 1; border-bottom: 1px dashed #e2e8f0; padding-bottom: 2px;"></span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                    <h3 style="margin: 0 0 24px 0; color: #334155; font-size: 20px; font-weight: 700; display: flex; items-center; gap: 10px;">
                        <span style="background: #f1f5f9; padding: 6px; border-radius: 8px; font-size: 16px;">🕒</span>
                        Time Blocking
                    </h3>
                    <table style="width: 100%; border-collapse: separate; border-spacing: 0;">
                        <thead>
                            <tr style="background: #f8fafc;">
                                <th style="text-align: left; padding: 12px 16px; border-top-left-radius: 8px; border-bottom: 2px solid #e2e8f0; color: #64748b; font-size: 14px; font-weight: 600; width: 100px;">Time</th>
                                <th style="text-align: left; padding: 12px 16px; border-top-right-radius: 8px; border-bottom: 2px solid #e2e8f0; color: #64748b; font-size: 14px; font-weight: 600;">Activity</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="padding: 16px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 500; font-size: 14px;">08:00 AM</td>
                                <td style="padding: 16px; border-bottom: 1px solid #f1f5f9;"></td>
                            </tr>
                            <tr>
                                <td style="padding: 16px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 500; font-size: 14px;">09:00 AM</td>
                                <td style="padding: 16px; border-bottom: 1px solid #f1f5f9;"></td>
                            </tr>
                            <tr>
                                <td style="padding: 16px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 500; font-size: 14px;">10:00 AM</td>
                                <td style="padding: 16px; border-bottom: 1px solid #f1f5f9;"></td>
                            </tr>
                            <tr>
                                <td style="padding: 16px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 500; font-size: 14px;">11:00 AM</td>
                                <td style="padding: 16px; border-bottom: 1px solid #f1f5f9;"></td>
                            </tr>
                            <tr>
                                <td style="padding: 16px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 500; font-size: 14px;">12:00 PM</td>
                                <td style="padding: 16px; border-bottom: 1px solid #f1f5f9; background: #f8fafc; color: #475569; font-style: italic;">Lunch Break</td>
                            </tr>
                            <tr>
                                <td style="padding: 16px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 500; font-size: 14px;">01:00 PM</td>
                                <td style="padding: 16px; border-bottom: 1px solid #f1f5f9;"></td>
                            </tr>
                            <tr>
                                <td style="padding: 16px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 500; font-size: 14px;">02:00 PM</td>
                                <td style="padding: 16px; border-bottom: 1px solid #f1f5f9;"></td>
                            </tr>
                            <tr>
                                <td style="padding: 16px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 500; font-size: 14px;">03:00 PM</td>
                                <td style="padding: 16px; border-bottom: 1px solid #f1f5f9;"></td>
                            </tr>
                            <tr>
                                <td style="padding: 16px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 500; font-size: 14px;">04:00 PM</td>
                                <td style="padding: 16px; border-bottom: 1px solid #f1f5f9;"></td>
                            </tr>
                            <tr>
                                <td style="padding: 16px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 500; font-size: 14px;">05:00 PM</td>
                                <td style="padding: 16px; border-bottom: 1px solid #f1f5f9;"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div style="margin-top: 32px; background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                    <h3 style="margin: 0 0 16px 0; color: #334155; font-size: 18px; font-weight: 600; display: flex; items-center; gap: 8px;">
                        <span style="background: #f1f5f9; padding: 4px; border-radius: 6px;">💭</span>
                        Notes & Reflections
                    </h3>
                    <p style="color: #94a3b8; font-style: italic; margin: 0; font-size: 14px;">Add your end-of-day thoughts here...</p>
                    <p><br><br></p>
                </div>
            </div>
        `
    },
    {
        id: 'goal-setting',
        title: 'Goal Setting',
        description: 'Define SMART goals and action plans.',
        icon: Target,
        category: 'planning',
        accent: 'red',
        content: `
    <div style="font-family: sans-serif; max-width: 800px; margin: 0 auto;">
                <h1 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">🎯 SMART Goal Setting</h1>
                
                <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #dc2626;">
                    <p style="margin: 5px 0;"><strong>🏆 Goal Statement:</strong> </p>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div style="border: 1px solid #fecaca; padding: 15px; border-radius: 8px;">
                        <h3 style="color: #b91c1c; margin-top: 0;">Specific</h3>
                        <p style="font-size: 0.9em; color: #666;">What exactly do you want to achieve?</p>
                        <p><br></p>
                    </div>
                    <div style="border: 1px solid #fecaca; padding: 15px; border-radius: 8px;">
                        <h3 style="color: #b91c1c; margin-top: 0;">Measurable</h3>
                        <p style="font-size: 0.9em; color: #666;">How will you know when you've achieved it?</p>
                        <p><br></p>
                    </div>
                    <div style="border: 1px solid #fecaca; padding: 15px; border-radius: 8px;">
                        <h3 style="color: #b91c1c; margin-top: 0;">Achievable</h3>
                        <p style="font-size: 0.9em; color: #666;">Is it realistic?</p>
                        <p><br></p>
                    </div>
                    <div style="border: 1px solid #fecaca; padding: 15px; border-radius: 8px;">
                        <h3 style="color: #b91c1c; margin-top: 0;">Relevant</h3>
                        <p style="font-size: 0.9em; color: #666;">Why is this important?</p>
                        <p><br></p>
                    </div>
                </div>
                
                <div style="border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin-top: 20px;">
                    <h3 style="color: #b91c1c; margin-top: 0;">Time-bound</h3>
                    <p style="font-size: 0.9em; color: #666;">When do you want to achieve this?</p>
                    <p><strong>Deadline:</strong> </p>
                </div>
            </div>
    `
    },
    {
        id: 'story-outline',
        title: 'Story Outline',
        description: 'Plot out your next great story or novel.',
        icon: PenTool,
        category: 'creative',
        accent: 'purple',
        content: `
    <div style="font-family: sans-serif; max-width: 800px; margin: 0 auto;">
                <h1 style="color: #9333ea; border-bottom: 2px solid #9333ea; padding-bottom: 10px;">✍️ Story Outline</h1>
                
                <div style="background-color: #f3e8ff; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #9333ea;">
                    <p style="margin: 5px 0;"><strong>📖 Title:</strong> </p>
                    <p style="margin: 5px 0;"><strong>🎭 Genre:</strong> </p>
                    <p style="margin: 5px 0;"><strong>💡 Logline:</strong> </p>
                </div>

                <h3 style="color: #7e22ce; background-color: #f3e8ff; padding: 8px; border-radius: 4px;">👥 Characters</h3>
                <div style="display: flex; gap: 20px;">
                    <div style="flex: 1; border: 1px solid #e9d5ff; padding: 10px; border-radius: 6px;">
                        <strong>🦸‍♂️ Protagonist</strong>
                        <p>Name: </p>
                        <p>Goal: </p>
                    </div>
                    <div style="flex: 1; border: 1px solid #e9d5ff; padding: 10px; border-radius: 6px;">
                        <strong>🦹‍♂️ Antagonist</strong>
                        <p>Name: </p>
                        <p>Goal: </p>
                    </div>
                </div>

                <h3 style="color: #7e22ce; background-color: #f3e8ff; padding: 8px; border-radius: 4px; margin-top: 20px;">📉 Plot Structure</h3>
                <ul style="list-style-type: none; padding-left: 0;">
                    <li style="margin-bottom: 10px; padding: 10px; border: 1px solid #e9d5ff; border-radius: 6px;"><strong>1. Inciting Incident:</strong> </li>
                    <li style="margin-bottom: 10px; padding: 10px; border: 1px solid #e9d5ff; border-radius: 6px;"><strong>2. Rising Action:</strong> </li>
                    <li style="margin-bottom: 10px; padding: 10px; border: 1px solid #e9d5ff; border-radius: 6px;"><strong>3. Climax:</strong> </li>
                    <li style="margin-bottom: 10px; padding: 10px; border: 1px solid #e9d5ff; border-radius: 6px;"><strong>4. Resolution:</strong> </li>
                </ul>
            </div>
    `
    },
    {
        id: 'travel-itinerary',
        title: 'Travel Itinerary',
        description: 'Plan your perfect trip day by day.',
        icon: Plane,
        category: 'lifestyle',
        accent: 'sky',
        featured: true,
        content: `
    <div style="font-family: sans-serif; max-width: 800px; margin: 0 auto;">
                <h1 style="color: #0ea5e9; border-bottom: 2px solid #0ea5e9; padding-bottom: 10px;">✈️ Travel Itinerary</h1>
                
                <div style="background-color: #e0f2fe; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #0ea5e9;">
                    <p style="margin: 5px 0;"><strong>🌍 Destination:</strong> </p>
                    <p style="margin: 5px 0;"><strong>📅 Dates:</strong> </p>
                </div>

                <h3 style="color: #0369a1; background-color: #bae6fd; padding: 8px; border-radius: 4px;">🏨 Accommodation</h3>
                <p><strong>Name:</strong> </p>
                <p><strong>Address:</strong> </p>
                <p><strong>Check-in/out:</strong> </p>

                <h3 style="color: #0369a1; background-color: #bae6fd; padding: 8px; border-radius: 4px; margin-top: 20px;">🗺️ Daily Plan</h3>
                <div style="border: 1px solid #bae6fd; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
                    <strong style="color: #0284c7;">Day 1</strong>
                    <ul style="margin-top: 5px;">
                        <li>🌅 Morning: </li>
                        <li>☀️ Afternoon: </li>
                        <li>🌙 Evening: </li>
                    </ul>
                </div>

                <h3 style="color: #0369a1; background-color: #bae6fd; padding: 8px; border-radius: 4px; margin-top: 20px;">🎒 Packing List</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div><input type="checkbox"> Passport/ID</div>
                    <div><input type="checkbox"> Chargers</div>
                    <div><input type="checkbox"> Toiletries</div>
                    <div><input type="checkbox"> Clothes</div>
                </div>
            </div>
    `
    },
    {
        id: 'workout-log',
        title: 'Workout Log',
        description: 'Track your exercises, sets, and reps.',
        icon: Dumbbell,
        category: 'lifestyle',
        accent: 'rose',
        content: `
    <div style="font-family: sans-serif; max-width: 800px; margin: 0 auto;">
                <h1 style="color: #e11d48; border-bottom: 2px solid #e11d48; padding-bottom: 10px;">💪 Workout Log</h1>
                
                <div style="background-color: #fff1f2; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #e11d48;">
                    <p style="margin: 5px 0;"><strong>📅 Date:</strong> ${new Date().toLocaleDateString()}</p>
                    <p style="margin: 5px 0;"><strong>🎯 Focus:</strong> (e.g., Upper Body, Cardio)</p>
                </div>

                <h3 style="color: #be123c; background-color: #ffe4e6; padding: 8px; border-radius: 4px;">🏋️‍♂️ Exercises</h3>
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <tr style="background-color: #ffe4e6;">
                        <th style="text-align: left; padding: 8px; border: 1px solid #fda4af;">Exercise</th>
                        <th style="text-align: left; padding: 8px; border: 1px solid #fda4af;">Sets</th>
                        <th style="text-align: left; padding: 8px; border: 1px solid #fda4af;">Reps</th>
                        <th style="text-align: left; padding: 8px; border: 1px solid #fda4af;">Weight</th>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #fda4af;"></td>
                        <td style="padding: 8px; border: 1px solid #fda4af;"></td>
                        <td style="padding: 8px; border: 1px solid #fda4af;"></td>
                        <td style="padding: 8px; border: 1px solid #fda4af;"></td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #fda4af;"></td>
                        <td style="padding: 8px; border: 1px solid #fda4af;"></td>
                        <td style="padding: 8px; border: 1px solid #fda4af;"></td>
                        <td style="padding: 8px; border: 1px solid #fda4af;"></td>
                    </tr>
                </table>

                <h3 style="color: #be123c; background-color: #ffe4e6; padding: 8px; border-radius: 4px; margin-top: 20px;">📝 Post-Workout Notes</h3>
                <div style="border: 1px dashed #fda4af; padding: 10px; border-radius: 6px;">
                    <p>How did it feel? Energy levels?</p>
                </div>
            </div>
    `
    },
    {
        id: 'recipe-card',
        title: 'Recipe Card',
        description: 'Save your favorite recipes with ingredients and steps.',
        icon: Utensils,
        category: 'lifestyle',
        accent: 'orange',
        content: `
    <div style="font-family: sans-serif; max-width: 800px; margin: 0 auto;">
                <h1 style="color: #ea580c; border-bottom: 2px solid #ea580c; padding-bottom: 10px;">🍳 Recipe: [Name]</h1>
                
                <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                    <div style="flex: 1; background-color: #ffedd5; padding: 10px; border-radius: 8px; text-align: center;">
                        <p style="margin: 0; font-size: 0.9em; color: #9a3412;">Prep Time</p>
                        <strong style="color: #ea580c;">00 mins</strong>
                    </div>
                    <div style="flex: 1; background-color: #ffedd5; padding: 10px; border-radius: 8px; text-align: center;">
                        <p style="margin: 0; font-size: 0.9em; color: #9a3412;">Cook Time</p>
                        <strong style="color: #ea580c;">00 mins</strong>
                    </div>
                    <div style="flex: 1; background-color: #ffedd5; padding: 10px; border-radius: 8px; text-align: center;">
                        <p style="margin: 0; font-size: 0.9em; color: #9a3412;">Servings</p>
                        <strong style="color: #ea580c;">0</strong>
                    </div>
                </div>

                <div style="display: flex; gap: 30px;">
                    <div style="flex: 1;">
                        <h3 style="color: #c2410c; border-bottom: 2px solid #fdba74; padding-bottom: 5px;">🥕 Ingredients</h3>
                        <ul style="list-style-type: none; padding-left: 0;">
                            <li style="margin-bottom: 5px; border-bottom: 1px dotted #fdba74; padding-bottom: 5px;"><input type="checkbox"> </li>
                            <li style="margin-bottom: 5px; border-bottom: 1px dotted #fdba74; padding-bottom: 5px;"><input type="checkbox"> </li>
                        </ul>
                    </div>
                    <div style="flex: 2;">
                        <h3 style="color: #c2410c; border-bottom: 2px solid #fdba74; padding-bottom: 5px;">👨‍🍳 Instructions</h3>
                        <ol>
                            <li style="margin-bottom: 10px;">Step 1...</li>
                            <li style="margin-bottom: 10px;">Step 2...</li>
                        </ol>
                    </div>
                </div>
            </div>
    `
    },
    {
        id: 'okr-tracker',
        title: 'OKR Tracker',
        description: 'Track Objectives and Key Results.',
        icon: Rocket,
        category: 'productivity',
        accent: 'blue',
        content: `
    <div style="font-family: sans-serif; max-width: 800px; margin: 0 auto;">
                <h1 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">🚀 OKR Tracker</h1>
                
                <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #2563eb;">
                    <p style="margin: 5px 0;"><strong>📅 Quarter:</strong> </p>
                </div>

                <div style="border: 1px solid #bfdbfe; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h3 style="color: #1e40af; margin-top: 0;">🎯 Objective</h3>
                    <p style="font-style: italic; color: #666;">What do you want to achieve?</p>
                    <p style="font-size: 1.2em; font-weight: bold; color: #1e3a8a;">[Insert Objective Here]</p>
                </div>

                <h3 style="color: #1e40af; background-color: #dbeafe; padding: 8px; border-radius: 4px;">📊 Key Results</h3>
                <ul style="list-style-type: none; padding-left: 0;">
                    <li style="margin-bottom: 15px; background-color: #f8fafc; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <strong>KR1: </strong>
                            <span>0%</span>
                        </div>
                        <div style="height: 8px; background-color: #e2e8f0; border-radius: 4px;">
                            <div style="width: 0%; height: 100%; background-color: #3b82f6; border-radius: 4px;"></div>
                        </div>
                    </li>
                    <li style="margin-bottom: 15px; background-color: #f8fafc; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <strong>KR2: </strong>
                            <span>0%</span>
                        </div>
                        <div style="height: 8px; background-color: #e2e8f0; border-radius: 4px;">
                            <div style="width: 0%; height: 100%; background-color: #3b82f6; border-radius: 4px;"></div>
                        </div>
                    </li>
                </ul>
            </div>
    `
    },
    {
        id: 'brainstorming',
        title: 'Brainstorming',
        description: 'Unleash creativity with a structured session.',
        icon: BrainCircuit,
        category: 'productivity',
        accent: 'violet',
        content: `
    <div style="font-family: sans-serif; max-width: 800px; margin: 0 auto;">
                <h1 style="color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 10px;">🧠 Brainstorming Session</h1>
                
                <div style="background-color: #f5f3ff; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #7c3aed;">
                    <p style="margin: 5px 0;"><strong>💡 Topic:</strong> </p>
                    <p style="margin: 5px 0;"><strong>👥 Participants:</strong> </p>
                </div>

                <h3 style="color: #5b21b6; background-color: #ede9fe; padding: 8px; border-radius: 4px;">🌩️ Idea Dump</h3>
                <ul style="margin-top: 10px;">
                    <li></li>
                    <li></li>
                </ul>

                <h3 style="color: #5b21b6; background-color: #ede9fe; padding: 8px; border-radius: 4px; margin-top: 20px;">🗳️ Top Picks</h3>
                <ol style="margin-top: 10px;">
                    <li style="font-weight: bold; color: #4c1d95;"></li>
                    <li style="font-weight: bold; color: #4c1d95;"></li>
                </ol>

                <h3 style="color: #5b21b6; background-color: #ede9fe; padding: 8px; border-radius: 4px; margin-top: 20px;">👣 Next Steps</h3>
                <ul style="list-style-type: none; padding-left: 0;">
                    <li style="margin-bottom: 8px;"><input type="checkbox"> </li>
                </ul>
            </div>
    `
    }
];

const getAccentStyles = (color) => {
    const styles = {
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 group-hover:border-blue-200 dark:group-hover:border-blue-800',
        indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 group-hover:border-indigo-200 dark:group-hover:border-indigo-800',
        pink: 'bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400 group-hover:border-pink-200 dark:group-hover:border-pink-800',
        green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 group-hover:border-green-200 dark:group-hover:border-green-800',
        orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 group-hover:border-orange-200 dark:group-hover:border-orange-800',
        yellow: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400 group-hover:border-yellow-200 dark:group-hover:border-yellow-800',
        teal: 'bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400 group-hover:border-teal-200 dark:group-hover:border-teal-800',
        red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 group-hover:border-red-200 dark:group-hover:border-red-800',
        purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 group-hover:border-purple-200 dark:group-hover:border-purple-800',
        sky: 'bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400 group-hover:border-sky-200 dark:group-hover:border-sky-800',
        rose: 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 group-hover:border-rose-200 dark:group-hover:border-rose-800',
        violet: 'bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400 group-hover:border-violet-200 dark:group-hover:border-violet-800',
    };
    return styles[color] || styles.blue;
};

const TemplatesView = ({ onCreateNote }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const filteredTemplates = templates.filter(template => {
        const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const featuredTemplates = templates.filter(t => t.featured);

    const handleUseTemplate = async (template) => {
        try {
            await onCreateNote({
                title: `${template.title} - ${new Date().toLocaleDateString()} `,
                content: template.content
            });
            toast.success(`Created note from ${template.title} `);
        } catch (error) {
            console.error('Failed to use template', error);
            toast.error('Failed to create note');
        }
    };

    return (
        <div className="flex-1 bg-gray-50 dark:bg-[#121212] p-4 sm:p-8 overflow-y-auto h-full">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
                            Templates Gallery
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            Jumpstart your workflow with professionally designed templates.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-72">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search templates..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-800 rounded-xl leading-5 bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* Featured Section (Only show if no search/filter) */}
                {searchQuery === '' && selectedCategory === 'all' && (
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-5 h-5 text-yellow-500" />
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Featured Collections</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {featuredTemplates.map(template => {
                                const accentStyle = getAccentStyles(template.accent);
                                return (
                                    <div
                                        key={template.id}
                                        onClick={() => handleUseTemplate(template)}
                                        className="relative overflow-hidden bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                                    >
                                        <div className={`absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-10 transition-all transform rotate-12`}>
                                            <template.icon className="w-40 h-40" />
                                        </div>

                                        <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${accentStyle} shadow-sm`}>
                                            <template.icon className="w-6 h-6" />
                                        </div>

                                        <div className="relative">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{template.title}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{template.description}</p>
                                            <div className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                                                Use Template <ArrowRight className="w-4 h-4 ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Category Filters */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === category.id
                                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg scale-105'
                                : 'bg-white dark:bg-[#1e1e1e] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#252525] border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                                }`}
                        >
                            <category.icon className="w-4 h-4" />
                            {category.label}
                        </button>
                    ))}
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredTemplates.map((template) => {
                        const accentStyle = getAccentStyles(template.accent);
                        return (
                            <div
                                key={template.id}
                                onClick={() => handleUseTemplate(template)}
                                className="group relative bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110 duration-300 ${accentStyle}`}>
                                    <template.icon className="w-6 h-6" />
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {template.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                                        {template.description}
                                    </p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        {categories.find(c => c.id === template.category)?.label}
                                    </span>
                                    <div className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all">
                                        Use Template
                                        <Plus className="w-4 h-4 ml-1" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredTemplates.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-[#1e1e1e] rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No templates found</h3>
                        <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TemplatesView;
