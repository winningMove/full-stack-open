import jwt from "jsonwebtoken";
import { info, error } from "./logger.js";
import { USER_SECRET } from "./config.js";
import User from "../models/user.js";

function reqLogger(req, _, next) {
  const { method, path, body } = req;
  info(method, "|", path, "|", ["POST", "PUT"].includes(method) ? body : "");
  next();
}

function unknownEndpoint(_, res) {
  res.status(404).send({ error: "unknown endpoint" });
}

function errHandler(err, _, res, next) {
  error(err.message);

  if (err.name === "CastError") {
    return res.status(400).json({ error: "malformed id" });
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  } else if (
    err.name === "MongoServerError" &&
    err.message.includes("duplicate key error")
  ) {
    return res.status(400).json({ error: "username must be unique" });
  } else if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "token invalid" });
  } else if (err.name === "TokenExpiredError") {
    return res.status(401).json({ error: "token expired" });
  }

  next(err);
}

async function userExtractor(req, res, next) {
  const auth = req.get("authorization");
  let token;
  if (auth?.startsWith("Bearer ")) {
    token = auth.replace("Bearer ", "");
  }
  try {
    const decoded = jwt.verify(token, USER_SECRET);
    if (!decoded.id) {
      return res.status(401).send({ error: "token invalid" });
    }
    req.user = await User.findById(decoded.id);
  } catch (err) {
    next(err);
  }
  next();
}

export { reqLogger, unknownEndpoint, errHandler, userExtractor };
