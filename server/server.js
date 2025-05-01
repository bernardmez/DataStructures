/**
 * Main Express server file
 */
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const scoreRoutes = require('./routes/scores');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/scores', scoreRoutes);

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// For graceful shutdown
process.on('SIGINT', async () => {
    console.log('Server shutting down');
    process.exit(0);
});