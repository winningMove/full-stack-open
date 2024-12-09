import { Router } from "express";
import Blog from "../models/blog.js";
import { userExtractor } from "../utils/middleware.js";
const blogRouter = Router();

blogRouter
  .route("/")
  .get(async (_, res, next) => {
    try {
      const blogs = await Blog.find({}).populate("user", "-blogs");
      res.json(blogs);
    } catch (err) {
      next(err);
    }
  })
  .post(userExtractor, async (req, res, next) => {
    if (!(req.body.title && req.body.url))
      return res.status(400).send({ error: "missing title or url field" });

    const { likes, ...rest } = req.body;
    try {
      const { user } = req;
      const newBlog = await new Blog({
        ...rest,
        likes: likes ?? 0,
        user: user._id,
      }).save();
      await newBlog.populate("user", "-blogs");

      user.blogs.push(newBlog._id);
      await user.save();

      res.status(201).json(newBlog);
    } catch (err) {
      next(err);
    }
  });

// PUT updated to work with frontend from part5
blogRouter
  .route("/:id")
  .put(async (req, res, next) => {
    if (Object.keys(req.body).length !== 5) {
      return res.status(400).send({ error: "missing field" });
    }
    if (!Object.keys(req.body).includes("likes")) {
      return res.status(400).send({ error: "missing likes field" });
    }
    try {
      const updatedBlog = await Blog.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      ).populate("user", "-blogs");
      res.json(updatedBlog);
    } catch (err) {
      next(err);
    }
  })
  .delete(userExtractor, async (req, res, next) => {
    try {
      const { user } = req;
      const blog = await Blog.findById(req.params.id);
      if (String(blog.user) !== String(user.id)) {
        return res
          .status(403)
          .send({ error: "current user cannot delete this blog" });
      }
      user.blogs = user.blogs.filter(
        (userBlog) => String(userBlog) !== String(blog.id)
      );
      await Promise.all([user.save(), blog.deleteOne()]);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  });

// Added to enable part7 functionality
blogRouter.route("/:id/comments").post(async (req, res, next) => {
  if (!req.body.comment)
    return res.status(400).send({ error: "missing comment field" });

  try {
    const blogToCommentOn = await Blog.findById(req.params.id);
    blogToCommentOn.comments.push(req.body.comment);
    await blogToCommentOn.save();
    res.status(201).json({ newComment: req.body.comment });
  } catch (err) {
    next(err);
  }
});

export default blogRouter;
