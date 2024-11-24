import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

const getAll = async () => {
  const { data } = await axios.get(baseUrl);
  return data;
};

const createNew = async (content) => {
  const { data } = await axios.post(baseUrl, { content, votes: 0 });
  return data;
};

const vote = async (anecdote) => {
  const { data } = await axios.put(`${baseUrl}/${anecdote.id}`, {
    ...anecdote,
    votes: anecdote.votes + 1,
  });
  return data;
};

export default { getAll, createNew, vote };
