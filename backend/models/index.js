const { connectDB, testConnection } = require('../config/database');
const User = require('./User');
const Url = require('./Url');

// Initialize database connection
const initializeDB = async () => {
  try {
    await connectDB();
    console.log('✅ Database initialized successfully.');
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    throw error;
  }
};

module.exports = {
  User,
  Url,
  initializeDB,
  testConnection
};