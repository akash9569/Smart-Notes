import Notebook from '../models/Notebook.js';

// @desc    Get all notebooks
// @route   GET /api/notebooks
// @access  Private
export const getNotebooks = async (req, res) => {
    try {
        const notebooks = await Notebook.find({ userId: req.user.id })
            .sort({ updatedAt: -1 });

        res.status(200).json({ success: true, data: { notebooks } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create new notebook
// @route   POST /api/notebooks
// @access  Private
export const createNotebook = async (req, res) => {
    try {
        const notebook = await Notebook.create({
            ...req.body,
            userId: req.user.id,
        });

        res.status(201).json({ success: true, data: { notebook } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// @desc    Update notebook
// @route   PUT /api/notebooks/:id
// @access  Private
export const updateNotebook = async (req, res) => {
    try {
        let notebook = await Notebook.findById(req.params.id);

        if (!notebook) {
            return res.status(404).json({ success: false, message: 'Notebook not found' });
        }

        // Make sure user owns notebook
        if (notebook.userId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        notebook = await Notebook.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({ success: true, data: { notebook } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete notebook
// @route   DELETE /api/notebooks/:id
// @access  Private
export const deleteNotebook = async (req, res) => {
    try {
        const notebook = await Notebook.findById(req.params.id);

        if (!notebook) {
            return res.status(404).json({ success: false, message: 'Notebook not found' });
        }

        // Make sure user owns notebook
        if (notebook.userId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        await notebook.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
