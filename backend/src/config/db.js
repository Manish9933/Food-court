const mongoose = require('mongoose');

// Vercel Serverless Connection Cache
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    console.log('✅ Reusing existing MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    try {
      cached.promise = mongoose.connect(process.env.MONGODB_URI, {
        bufferCommands: false,
      }).then((mongoose) => {
        console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
        return mongoose;
      });
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      process.exit(1);
    }
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

module.exports = connectDB;
