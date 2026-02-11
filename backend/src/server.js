const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path'); 
const shopRoutes = require('./routes/shopRoutes');

dotenv.config({ path: path.join(__dirname, '../.env') });

console.log("DEBUG CHECK -> MONGO_URI is:", process.env.MONGO_URI ? "LOADED" : "MISSING");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/shops', shopRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});