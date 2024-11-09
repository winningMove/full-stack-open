import { describe, it, beforeEach, after } from "node:test";
import assert from "node:assert";
import supertest from "supertest";
import mongoose from "mongoose";
import User from "../models/user.js";
import { getInitialUserObj } from "./test_helper.js";
import app from "../app.js";

const req = supertest(app);
const initialUserObj = await getInitialUserObj();

describe("with one user already in database", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await new User(initialUserObj).save();
  });
  describe("GET /api/users", () => {
    it("correctly returns list of users", async () => {
      const res = await req
        .get("/api/users")
        .expect(200)
        .expect("Content-Type", /json/);
      assert.strictEqual(res.body.length, 1);
      assert.strictEqual(res.body[0].username, initialUserObj.username);
    });
  });

  describe("POST /api/users", () => {
    it("succeeds and modifies database", async () => {
      const res = await req
        .post("/api/users")
        .send({
          username: "Username 2",
          name: "Surry Durry",
          password: "testing2",
        })
        .expect(201)
        .expect("Content-Type", /json/);
      assert.strictEqual(res.body.username, "Username 2");
      assert(!res.body.password);

      const users = await User.find({});
      assert.strictEqual(users.length, 2);
      assert(users.some((user) => user.username === res.body.username));
    });
    it("fails for duplicate username", async () => {
      const res = await req
        .post("/api/users")
        .send({
          username: initialUserObj.username,
          name: "Surry Dust",
          password: "testing7",
        })
        .expect(400);
      assert.strictEqual(res.body.error, "username must be unique");

      const users = await User.find({});
      assert.strictEqual(users.length, 1);
    });
    it("fails for missing username or password", async () => {
      const res = await Promise.all([
        req
          .post("/api/users")
          .send({
            username: "",
            name: "Surry Dust",
            password: "testing7",
          })
          .expect(400),
        req
          .post("/api/users")
          .send({
            username: "tilly",
            name: "Surry Dust",
          })
          .expect(400),
      ]);
      assert(
        res.every(
          (response) => response.body.error === "missing username or password"
        )
      );
    });
    it("fails when password is too short", async () => {
      const res = await req
        .post("/api/users")
        .send({
          username: "Username 7",
          name: "",
          password: "te",
        })
        .expect(400);
      assert(res.body.error.includes("at least 3"));
    });
    it("fails when username is too short", async () => {
      const res = await req
        .post("/api/users")
        .send({
          username: "Us",
          name: "Bloopy Bloopster",
          password: "tesakldhg",
        })
        .expect(400);
      assert(res.body.error.includes("shorter than the minimum"));
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
