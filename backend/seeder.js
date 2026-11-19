import dotenv from 'dotenv';
import connectDB from './config/db.js';
import products from './data/products.js';
import Product from './models/productModel.js';
import User from './models/userModel.js';

dotenv.config();

await connectDB();

const importData = async () => {
  try {
    // 1. Clear any existing products & users
    await Product.deleteMany();
    await User.deleteMany();

    // 2. Create sample admin and customer users
    const adminUser = await User.create({
      name: 'Admin Manager',
      email: 'admin@novastore.com',
      password: 'adminpassword123',
      isAdmin: true,
    });

    const customerUser = await User.create({
      name: 'Sarah Connor',
      email: 'sarah@example.com',
      password: 'password123',
      isAdmin: false,
    });

    // 3. Insert sample products into MongoDB
    const createdProducts = await Product.insertMany(products);

    console.log(`🎉 Successfully imported ${createdProducts.length} products!`);
    console.log(`👤 Created Admin Account: admin@novastore.com / adminpassword123`);
    console.log(`👤 Created Customer Account: sarah@example.com / password123`);
    process.exit();
  } catch (error) {
    console.error(`❌ Seeder Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();
    console.log('🗑️ All products and users cleared from MongoDB!');
    process.exit();
  } catch (error) {
    console.error(`❌ Seeder Destroy Error: ${error.message}`);
    process.exit(1);
  }
};

// Check if flag -d was passed
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
