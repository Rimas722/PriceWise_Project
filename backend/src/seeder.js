const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('./models/User');
const Shop = require('./models/Shop');
const Product = require('./models/Product');
const Price = require('./models/Price');

mongoose.connect(process.env.MONGO_URI);

const importData = async () => {
  try {
    await Price.deleteMany();
    await Product.deleteMany();
    await Shop.deleteMany();
    await User.deleteMany();

    console.log('🧹 Data Destroyed (Clean Slate)...');

    const users = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@pricewise.com',
        password: 'password123', 
        role: 'admin',
      },
      {
        name: 'Shop Owner 1',
        email: 'shop1@pricewise.com',
        password: 'password123',
        role: 'shop_owner',
      },
      {
        name: 'Consumer User',
        email: 'user@pricewise.com',
        password: 'password123',
        role: 'consumer',
      },
    ]);

    const adminUser = users[0]._id;
    const shopOwner = users[1]._id;
    const consumerUser = users[2]._id;

    console.log('✅ Users Created');

    const shops = await Shop.insertMany([
      {
        owner: shopOwner,
        shopName: 'Kandy City Grocers',
        address: '12 Dalada Veediya, Kandy',
        location: { type: 'Point', coordinates: [80.6350, 7.2906] }, 
        phoneNumber: '0812223333',
      },
      {
        owner: shopOwner,
        shopName: 'Peradeniya Fresh Market',
        address: '45 Galaha Road, Peradeniya',
        location: { type: 'Point', coordinates: [80.5960, 7.2650] },
        phoneNumber: '0812224444',
      },
    ]);

    console.log('✅ Shops Created');

    const products = await Product.insertMany([
      {
        name: 'Keeri Samba Rice',
        category: 'Rice',
        unit: 'kg',
        image: 'https://placehold.co/200x200?text=Rice',
      },
      {
        name: 'Anchor Full Cream Milk Powder',
        category: 'Dairy',
        unit: 'packet', 
        image: 'https://placehold.co/200x200?text=Milk',
      },
      {
        name: 'Carrots',
        category: 'Vegetables',
        unit: 'kg',
        image: 'https://placehold.co/200x200?text=Carrot',
      },
    ]);

    console.log('✅ Products Created');

    await Price.insertMany([
      {
        product: products[0]._id, 
        shop: shops[0]._id, 
        submittedBy: shopOwner,
        price: 260,
        status: 'approved',
      },
      {
        product: products[1]._id, 
        shop: shops[0]._id,
        submittedBy: shopOwner,
        price: 1150,
        status: 'approved',
      },

      {
        product: products[0]._id, 
        shop: shops[1]._id, 
        submittedBy: shopOwner,
        price: 245, 
        status: 'approved',
      },
    ]);

    console.log('✅ Prices Created');
    console.log('🎉 DATA IMPORTED SUCCESSFULLY!');
    process.exit();

  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

importData();