import mongoose from 'mongoose';
import dns from 'dns';

// Ensure Node.js uses Google DNS to avoid Windows router querySrv ECONNREFUSED issues
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (err) {
  // Fallback gracefully if not permitted in environment
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    console.log(`📦 Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
