import { Router } from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";
const userRouter = Router();

userRouter
  .route("/")
  .get(async (_, res, next) => {
    try {
      const users = await User.find({}).populate("blogs", "-likes -user");
      res.json(users);
    } catch (err) {
      next(err);
    }
  })
  .post(async (req, res, next) => {
    const { username, name, password } = req.body;
    if (!(username && password))
      return res.status(400).send({ error: "missing username or password" });
    if (password.length < 3)
      return res
        .status(400)
        .send({ error: "password must be at least 3 characters long" });

    try {
      const hash = await bcrypt.hash(password, 10);
      const user = await new User({ username, name, password: hash }).save();
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  });

export default userRouter;
