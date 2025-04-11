const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true, trim: true }
}, { timestamps: true });  // Automatically creates createdAt and updatedAt

// Configure the schema to hide __v in the JSON output
categorySchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.__v;
        return ret;
    }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
