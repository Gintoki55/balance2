import mongoose from "mongoose";

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(
    "mongodb+srv://desaltqtn123:desalt123@desalt.0rlb81v.mongodb.net/?retryWrites=true&w=majority&appName=desalt",
    { dbName: "desalt" }
  );
  console.log("✅ MongoDB Connected");
};
