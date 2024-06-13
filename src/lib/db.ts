import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("Already connected to MongoDB");
      return;
    }
    const conn = await mongoose.connect(process.env.MONGODB_URL as string);

    console.log("🚀 ~ connectDB ~ 연결 시작:", conn.connection.host);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default connectDB;
