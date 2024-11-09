import e from "express";
import cors from "cors";
import mongoose from "mongoose";
import { MONGO_URI } from "./utils/config.js";
import { info, error } from "./utils/logger.js";
import blogRouter from "./controllers/blogs.js";
import userRouter from "./controllers/users.js";
import loginRouter from "./controllers/login.js";
import { reqLogger, unknownEndpoint, errHandler } from "./utils/middleware.js";

const app = e();

try {
  await mongoose.connect(MONGO_URI);
  info("Connected to DB");
} catch (err) {
  error("Failed to connect to DB:", err.message);
}

app.use(cors(), e.json(), reqLogger);

app.use("/api/blogs", blogRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);

app.use(unknownEndpoint, errHandler);

export default app;
