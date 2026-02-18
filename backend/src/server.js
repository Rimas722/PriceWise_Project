const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path'); 
const shopRoutes = require('./routes/shopRoutes');
const priceRoutes = require('./routes/priceRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const reportRoutes = require('./routes/reportRoutes');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const categoryRoutes = require('./routes/categoryRoutes');


dotenv.config({ path: path.join(__dirname, '../.env') });

console.log("DEBUG CHECK -> MONGO_URI is:", process.env.MONGO_URI ? "LOADED" : "MISSING");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/shops', shopRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});