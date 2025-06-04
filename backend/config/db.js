// backend/config/db.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    });
    console.log("✅ MongoDB connected successfully");

    // Check if the predefined user (supervisor) exists
    const existingUser = await User.findOne({ email: "admin@gmail.com" });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash("password123", 10);
      const newUser = new User({
        cid: "12345678901",
        email: "admin@gmail.com",
        phone: "17777777", // No phone needed for admin
        password: hashedPassword,
        isSupervisor: true, // Mark this user as supervisor
        role: "admin", // Set role to admin
      });

      await newUser.save();
      console.log(
        "✅ Predefined supervisor (government) user inserted into database."
      );
    } else {
      console.log("ℹ️ Predefined supervisor already exists.");
    }
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
