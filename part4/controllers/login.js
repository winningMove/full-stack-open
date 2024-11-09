import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Router } from "express";
import User from "../models/user.js";
import { USER_SECRET } from "../utils/config.js";
const loginRouter = Router();

loginRouter.post("/", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    const isPasswordCorrect = user
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!(user && isPasswordCorrect)) {
      return res.status(401).send({ error: "invalid username or password" });
    }

    const token = jwt.sign({ username, id: user._id }, USER_SECRET, {
      expiresIn: "24h",
    });

    res.json({ token, username, name: user.name });
  } catch (err) {
    next(err);
  }
});

export default loginRouter;
