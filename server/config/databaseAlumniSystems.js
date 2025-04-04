import dotenv from "dotenv";
import colors from "colors";
import mongoose from "mongoose";

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      ` MongoDB Connected: ${conn.connection.host}`.black.bgGreen.bold
    );
  } catch (error) {
    console.error(
      " MongoDB Connection Failed:".white.bgRed.bold,
      error.message.red.italic
    );
    process.exit(1);
  }
};

export default connectDB;
