import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/user.js";
import Blog from "../models/blog.js";

const clearDb = async (url) => {
  const con = await mongoose.createConnection(url).asPromise();
  await Promise.all([
    con.model("User", User.schema).deleteMany({}),
    con.model("Blog", Blog.schema).deleteMany({}),
  ]);
  await con.close();
};
await Promise.all([
  clearDb(process.env.MONGO_URI),
  clearDb(process.env.TEST_MONGO_URI),
]);
