/**
 * Mongoose model for score data
 */
const mongoose = require('mongoose');

/**
 * Score Schema
 * Defines the structure for score documents in MongoDB
 */
const scoreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 20
    },
    score: {
        type: Number,
        required: true,
        min: 0
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Add indexing for better query performance
scoreSchema.index({ score: -1 });

module.exports = mongoose.model('Score', scoreSchema);