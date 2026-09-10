const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    const defaultURI = "mongodb+srv://bca2023035_db_user:qX3A5drCROMhJn6I@cluster0.e5qmeip.mongodb.net/?appName=Cluster0";
    const uri = process.env.MONGO_URI || defaultURI;
    
    await mongoose.connect(uri);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
