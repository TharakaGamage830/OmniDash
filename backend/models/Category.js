const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    prefix: { type: String, required: true, uppercase: true, maxLength: 3 }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
