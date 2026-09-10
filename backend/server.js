const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/pg', require('./routes/pg.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/complaints', require('./routes/complaint.routes'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to PG Complaint Management System API' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
