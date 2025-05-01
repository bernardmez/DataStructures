/**
 * API routes for score management
 */
const express = require('express');
const router = express.Router();
const Score = require('../models/score');

/**
 * @route   GET /api/scores
 * @desc    Get top 10 scores
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        const scores = await Score.find()
            .sort({ score: -1 })
            .limit(10)
            .select('name score date');
        
        res.json(scores);
    } catch (err) {
        console.error('Error fetching scores:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   POST /api/scores
 * @desc    Add a new score
 * @access  Public
 */
router.post('/', async (req, res) => {
    try {
        const { name, score } = req.body;
        
        // Input validation
        if (!name || typeof score !== 'number') {
            return res.status(400).json({ message: 'Invalid input' });
        }
        
        const newScore = new Score({
            name: name.substring(0, 20), // Limit name length
            score,
            date: new Date()
        });
        
        await newScore.save();
        res.status(201).json(newScore);
    } catch (err) {
        console.error('Error saving score:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;