import { describe, it, beforeEach, after, before } from "node:test";
import assert from "node:assert";
import supertest from "supertest";
import mongoose from "mongoose";
import Blog from "../models/blog.js";
import User from "../models/user.js";
import app from "../app.js";
import {
  initialBlogs,
  samplePostBlog,
  getInitialUserObj,
} from "./test_helper.js";

const req = supertest(app);
const initialUserObj = await getInitialUserObj();
let validToken, initBlogsWithUser;

before(async () => {
  await User.deleteMany({});
  const user = await new User(initialUserObj).save();
  const res = await req
    .post("/api/login")
    .send({ username: user.username, password: "testpwd" });
  validToken = res.body.token;
  initBlogsWithUser = initialBlogs.map((b) => {
    b.user = user.id;
    return b;
  });
});

describe("with some blogs and one user initially in the database", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    const initBlogs = await Blog.insertMany(initBlogsWithUser);
    const initBlogIds = initBlogs.map((b) => b.id);
    await User.findOneAndUpdate({}, { blogs: initBlogIds });
  });

  describe("data returned by GET /api/blogs", () => {
    it("has correct length", async () => {
      const res = await req
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /json/);
      assert.strictEqual(res.body.length, initialBlogs.length);
    });
    it("has objects with property id, not property _id", async () => {
      const res = await req
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /json/);
      assert(Object.hasOwn(res.body[0], "id"));
      assert(!Object.hasOwn(res.body[3], "_id"));
    });
  });

  describe("POST /api/blogs", () => {
    it("succeeds and modifies database", async () => {
      const res = await req
        .post("/api/blogs")
        .set("Authorization", `Bearer ${validToken}`)
        .send(samplePostBlog)
        .expect(201)
        .expect("Content-Type", /json/);
      assert.strictEqual(res.body.title, samplePostBlog.title);

      const [dbContent, updatedUser] = await Promise.all([
        Blog.find({}),
        User.findOne({}),
      ]);
      assert.strictEqual(dbContent.length, 7);
      assert(dbContent.some((blog) => blog.title === samplePostBlog.title));
      assert.strictEqual(
        updatedUser.blogs.length,
        initBlogsWithUser.length + 1
      );
    });

    it("fails with invalid or missing token", async () => {
      const resArr = await Promise.all([
        req
          .post("/api/blogs")
          .set("Authorization", `Bearer ${validToken.slice(1)}`)
          .send(samplePostBlog)
          .expect(401)
          .expect("Content-Type", /json/),
        req
          .post("/api/blogs")
          .send(samplePostBlog)
          .expect(401)
          .expect("Content-Type", /json/),
      ]);
      assert(resArr.every((res) => res.body.error === "token invalid"));
    });

    it("succeeds with missing likes field, which defaults to 0", async () => {
      const samplePostBlogNoLikes = { ...samplePostBlog };
      delete samplePostBlogNoLikes.likes;
      const res = await req
        .post("/api/blogs")
        .set("Authorization", `Bearer ${validToken}`)
        .send(samplePostBlogNoLikes)
        .expect(201)
        .expect("Content-Type", /json/);
      assert.strictEqual(res.body.likes, 0);
    });

    it("fails without title or url property", async () => {
      const samplePostBlogNoTitle = { ...samplePostBlog };
      delete samplePostBlogNoTitle.title;
      const samplePostBlogNoUrl = { ...samplePostBlog };
      delete samplePostBlogNoUrl.url;

      await Promise.all([
        req
          .post("/api/blogs")
          .set("Authorization", `Bearer ${validToken}`)
          .send(samplePostBlogNoTitle)
          .expect(400),
        req
          .post("/api/blogs")
          .set("Authorization", `Bearer ${validToken}`)
          .send(samplePostBlogNoUrl)
          .expect(400),
      ]);
    });
  });

  describe("DELETE /api/blogs/:id", () => {
    it("succeeds", async () => {
      const blogToDelete = await Blog.findOne({});

      await req
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set("Authorization", `Bearer ${validToken}`)
        .expect(204);

      const [deletedBlog, updatedUser] = await Promise.all([
        Blog.findById(blogToDelete.id),
        User.findOne({}),
      ]);
      assert.strictEqual(deletedBlog, null);
      assert.strictEqual(
        updatedUser.blogs.length,
        initBlogsWithUser.length - 1
      );
    });

    it("fails with bad id", async () => {
      const res = await req
        .delete(`/api/blogs/8sdg86gh83`)
        .set("Authorization", `Bearer ${validToken}`)
        .expect(400);
      assert.strictEqual(res.body.error, "malformed id");
    });

    it("fails with invalid or missing token", async () => {
      const blogToDelete = await Blog.findOne({});
      const resArr = await Promise.all([
        req
          .delete(`/api/blogs/${blogToDelete.id}`)
          .set("Authorization", `Bearer ${validToken.slice(1)}`)
          .expect(401)
          .expect("Content-Type", /json/),
        req
          .delete(`/api/blogs/${blogToDelete.id}`)
          .expect(401)
          .expect("Content-Type", /json/),
      ]);
      assert(resArr.every((res) => res.body.error === "token invalid"));
    });
  });

  describe("PUT /api/blogs/:id", () => {
    it("succeeds", async () => {
      const blogToUpdate = await Blog.findOne({});

      const res = await req
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set("Authorization", `Bearer ${validToken}`)
        .send({ likes: 100 })
        .expect(200)
        .expect("Content-Type", /json/);
      assert.strictEqual(res.body.likes, 100);
      const shouldBeUpdated = await Blog.findById(blogToUpdate.id);
      assert.strictEqual(shouldBeUpdated.likes, 100);
    });

    it("fails with bad id", async () => {
      const res = await req
        .put(`/api/blogs/8sdg86gh83`)
        .set("Authorization", `Bearer ${validToken}`)
        .send({ likes: 100 })
        .expect(400);
      assert.strictEqual(res.body.error, "malformed id");
    });

    it("fails with missing likes field in content", async () => {
      const blogToUpdate = await Blog.findOne({});
      const res = await req
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set("Authorization", `Bearer ${validToken}`)
        .send({ lik: 100 })
        .expect(400);
      assert.strictEqual(res.body.error, "missing likes field");
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
