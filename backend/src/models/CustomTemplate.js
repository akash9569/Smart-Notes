import mongoose from 'mongoose';

const customTemplateSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: [true, 'Template name is required'],
            trim: true,
            maxlength: [100, 'Name cannot exceed 100 characters'],
        },
        url: {
            type: String,
            required: [true, 'Template URL is required'],
        },
        publicId: {
            type: String,
            required: [true, 'Cloudinary public_id is required'],
        },
        type: {
            type: String,
            enum: ['image', 'pdf'],
            default: 'image',
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to ensure unique template names per user
customTemplateSchema.index({ userId: 1, name: 1 }, { unique: true });

const CustomTemplate = mongoose.model('CustomTemplate', customTemplateSchema);

export default CustomTemplate;
