import {
    FileText,
    Grid3x3,
    Circle,
    Columns,
    Calendar,
    CalendarDays,
    ListChecks,
    Sun,
    Moon,
    Book
} from 'lucide-react';

export const TEMPLATES = [
    {
        id: 'blank',
        name: 'Blank Page',
        description: 'Clean slate for free-form notes',
        category: 'default',
        icon: FileText,
        preview: 'blank',
        variants: []
    },
    {
        id: 'lined-medium-default',
        name: 'Lined Paper',
        description: 'Classic ruled notebook',
        category: 'default',
        icon: FileText,
        preview: 'lined',
        variants: [
            { id: 'lined-small-default', name: 'Small Lines', lineHeight: 24 },
            { id: 'lined-medium-default', name: 'Medium Lines', lineHeight: 32 },
            { id: 'lined-large-default', name: 'Large Lines', lineHeight: 40 },
            { id: 'lined-medium-cream', name: 'Cream Paper', lineHeight: 32 }
        ]
    },
    {
        id: 'grid-medium-default',
        name: 'Grid Paper',
        description: 'Perfect for diagrams and sketches',
        category: 'default',
        icon: Grid3x3,
        preview: 'grid',
        variants: [
            { id: 'grid-small-default', name: 'Small Grid', gridSize: 16 },
            { id: 'grid-medium-default', name: 'Medium Grid', gridSize: 20 },
            { id: 'grid-large-default', name: 'Large Grid', gridSize: 24 },
            { id: 'grid-medium-cream', name: 'Cream Paper', gridSize: 20 }
        ]
    },
    {
        id: 'dotgrid-default',
        name: 'Dot Grid',
        description: 'Ideal for bullet journaling',
        category: 'default',
        icon: Circle,
        preview: 'dotgrid',
        variants: [
            { id: 'dotgrid-default', name: 'Default' },
            { id: 'dotgrid-cream', name: 'Cream Paper' }
        ]
    },
    {
        id: 'cornell',
        name: 'Cornell Notes',
        description: 'Two-column note-taking system',
        category: 'default',
        icon: Columns,
        preview: 'cornell',
        variants: []
    },
    {
        id: 'monthly-planner',
        name: 'Monthly Planner',
        description: 'Calendar grid layout',
        category: 'default',
        icon: Calendar,
        preview: 'monthly',
        variants: []
    },
    {
        id: 'weekly-planner',
        name: 'Weekly Planner',
        description: 'Week at a glance',
        category: 'default',
        icon: CalendarDays,
        preview: 'weekly',
        variants: []
    },
    {
        id: 'checklist',
        name: 'Checklist',
        description: 'Organized task list',
        category: 'default',
        icon: ListChecks,
        preview: 'checklist',
        variants: []
    },
    {
        id: 'calendar',
        name: 'Calendar Layout',
        description: 'Monthly calendar view',
        category: 'default',
        icon: Calendar,
        preview: 'calendar',
        variants: []
    },
    {
        id: 'morning-journal',
        name: 'Morning Journal',
        description: 'Set intentions and gratitude',
        category: 'journal',
        icon: Sun,
        preview: 'lined',
        variants: []
    },
    {
        id: 'night-reflection',
        name: 'Night Reflection',
        description: 'Review your day and mood',
        category: 'journal',
        icon: Moon,
        preview: 'lined',
        variants: []
    },
    {
        id: 'gratitude-journal',
        name: 'Gratitude Journal',
        description: 'Focus on the positive',
        category: 'journal',
        icon: Book,
        preview: 'lined',
        variants: []
    }
];

export const getTemplateById = (id) => {
    // Check main templates
    const mainTemplate = TEMPLATES.find(t => t.id === id);
    if (mainTemplate) return mainTemplate;

    // Check variants
    for (const template of TEMPLATES) {
        const variant = template.variants.find(v => v.id === id);
        if (variant) return variant;
    }

    return null;
};
