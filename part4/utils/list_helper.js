import _ from "lodash";
import { info } from "./logger.js";

function dummy(blogs) {
  info("Dummy", blogs);
  return 1;
}

function totalLikes(blogs) {
  const sumOfLikes = _.sumBy(blogs, "likes");
  return sumOfLikes;
}

function favoriteBlog(blogs) {
  if (blogs.length === 0) return undefined;

  const { title, author, likes } = _.maxBy(blogs, "likes");
  return { title, author, likes };
}

function mostBlogs(blogs) {
  if (blogs.length === 0) return undefined;

  const authorBlogCounts = _.countBy(blogs, "author");
  const asObjArray = _.map(authorBlogCounts, (count, author) => ({
    author,
    blogs: count,
  }));
  const mostBlogs = _.maxBy(asObjArray, "blogs");
  return mostBlogs;
}

function mostLikes(blogs) {
  if (blogs.length === 0) return undefined;

  const byAuthors = _.groupBy(blogs, "author");
  const withLikes = _.map(byAuthors, (blogs, author) => ({
    author,
    likes: _.sumBy(blogs, "likes"),
  }));
  const mostLikes = _.maxBy(withLikes, "likes");
  return mostLikes;
}

export { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
