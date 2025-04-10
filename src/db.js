const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected!');
    } catch (error) {
        console.error('Error trying to connect to mongoDb', error);
        process.exit(1);
    }
};

module.exports = connectDB;
