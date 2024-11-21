import { Router } from "express";
import Blog from "../models/blog.js";
import User from "../models/user.js";
const testingRouter = Router();

testingRouter.route("/reset").post(async (_, res, next) => {
  try {
    await Promise.all([Blog.deleteMany({}), User.deleteMany({})]);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

export default testingRouter;
