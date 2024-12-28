import mongoose from "mongoose";
import { MONGO_URI } from "./config.js";

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Conected to DB");
  } catch (err) {
    console.err("Error connecting to DB:", err.message);
    process.exit(1);
  }
};
