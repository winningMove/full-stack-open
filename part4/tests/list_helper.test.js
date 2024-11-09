import { test, describe, it } from "node:test";
import assert from "node:assert";
import {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
} from "../utils/list_helper.js";
import { listWithOneBlog, testBlogs } from "./test_helper.js";

test("dummy returns 1", () => {
  assert.strictEqual(dummy([]), 1);
});

describe("total likes", () => {
  it("is zero for empty list", () => {
    assert.strictEqual(totalLikes([]), 0);
  });
  it("is 5 for array of one blog with 5 likes", () => {
    assert.strictEqual(totalLikes(listWithOneBlog), 5);
  });
  it("is correct for larger list", () => {
    assert.strictEqual(totalLikes(testBlogs), 36);
  });
});

describe("favorite blog", () => {
  it("is undefined for empty list", () => {
    assert.strictEqual(favoriteBlog([]), undefined);
  });
  it("is the single element in array of one blog", () => {
    const { title, author, likes } = listWithOneBlog[0];
    assert.deepStrictEqual(favoriteBlog(listWithOneBlog), {
      title,
      author,
      likes,
    });
  });
  it("is correct for larger list", () => {
    const { title, author, likes } = testBlogs[2];
    assert.deepStrictEqual(favoriteBlog(testBlogs), { title, author, likes });
  });
});

describe("most blogs", () => {
  it("is undefined for empty list", () => {
    assert.strictEqual(mostBlogs([]), undefined);
  });
  it("is the single author with blog count of 1 in array of one blog", () => {
    const { author } = listWithOneBlog[0];
    assert.deepStrictEqual(mostBlogs(listWithOneBlog), {
      author,
      blogs: 1,
    });
  });
  it("is correct for larger list", () => {
    assert.deepStrictEqual(mostBlogs(testBlogs), {
      author: "Robert C. Martin",
      blogs: 3,
    });
  });
});

describe("most likes", () => {
  it("is undefined for empty list", () => {
    assert.strictEqual(mostLikes([]), undefined);
  });
  it("is the single author with blog's likes in array of one blog", () => {
    const { author, likes } = listWithOneBlog[0];
    assert.deepStrictEqual(mostLikes(listWithOneBlog), {
      author,
      likes,
    });
  });
  it("is correct for larger list", () => {
    assert.deepStrictEqual(mostLikes(testBlogs), {
      author: "Edsger W. Dijkstra",
      likes: 17,
    });
  });
});
