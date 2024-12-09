import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = async (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const { data } = await axios.get(baseUrl);
  return data;
};

const create = async (newBlog) => {
  try {
    const { data } = await axios.post(baseUrl, newBlog, {
      headers: { Authorization: token },
    });
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.error ?? err.message);
  }
};

const update = async (blogId, updatedBlog) => {
  const { data } = await axios.put(`${baseUrl}/${blogId}`, updatedBlog);
  return data;
};

const remove = async (blogId) => {
  try {
    await axios.delete(`${baseUrl}/${blogId}`, {
      headers: { Authorization: token },
    });
  } catch (err) {
    throw new Error(err.response?.data?.error ?? err.message);
  }
};

const addComment = async (blogId, newComment) => {
  const { data } = await axios.post(
    `${baseUrl}/${blogId}/comments`,
    newComment
  );
  return data;
};

export default { getAll, setToken, create, update, remove, addComment };
