/**
 * Database connection configuration
 */
const mongoose = require('mongoose');

// MongoDB connection URI (environment variable or default)
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/snakegame';

/**
 * Connect to MongoDB
 * @returns {Promise} Mongoose connection promise
 */
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Handle MongoDB connection errors after initial connect
        mongoose.connection.on('error', (err) => {
            console.error(`MongoDB connection error: ${err}`);
        });
        
        return conn;
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;