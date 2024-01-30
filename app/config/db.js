// app/db.js

const mongoose = require('mongoose');
const dbConfig = require('./db.config');

// MongoDB connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, options);
    console.log('Successfully connected to MongoDB.');
  } catch (error) {
    console.error('Connection error:', error);
    process.exit(1); // Exit the process if unable to connect to MongoDB
  }
};

module.exports = connectDB;
