import StickyNote from '../models/StickyNote.js';

export const getStickyNotes = async (req, res) => {
    try {
        const notes = await StickyNote.find({ user: req.user._id }).sort({ isPinned: -1, updatedAt: -1 });
        res.status(200).json({
            success: true,
            data: { notes }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

export const createStickyNote = async (req, res) => {
    try {
        const newNote = await StickyNote.create({
            user: req.user._id,
            ...req.body
        });
        res.status(201).json({
            success: true,
            data: { note: newNote }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

export const updateStickyNote = async (req, res) => {
    try {
        const note = await StickyNote.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Sticky note not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { note }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

export const deleteStickyNote = async (req, res) => {
    try {
        const note = await StickyNote.findOneAndDelete({ _id: req.params.id, user: req.user._id });

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Sticky note not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};
