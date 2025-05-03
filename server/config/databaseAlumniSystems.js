// config/db.js
import dotenv from "dotenv";
import colors from "colors";
import mongoose from "mongoose";


dotenv.config();

const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `✅ Successfully connected to the ${
        "Alumni Management System".bold.blue
      } database for ${"DY Patil University, Pune (Ambi)".bold.green}!\n` +
        `🌐 Database Host: ${conn.connection.host}`.black.bgGreen.bold
    );
  } catch (error) {
    console.error(
      `❌ ${
        "Failed to connect to the Alumni Management System database".red.bold
      }: ${error.message.white.bgRed.italic}\n` +
        "⚠️ Please check your database connection string or network connection."
    );
    process.exit(1);
  }
};

export default connectDB;
