import Tag from '../models/Tag.js';

// @desc    Get all tags
// @route   GET /api/tags
// @access  Private
export const getTags = async (req, res) => {
    try {
        const tags = await Tag.find({ userId: req.user.id })
            .sort({ name: 1 });

        res.status(200).json({ success: true, data: { tags } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
