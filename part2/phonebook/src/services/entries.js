import axios from "axios";

const baseUrl = "http://localhost:3001/entries";

const getAll = async () => {
  const { data } = await axios.get(baseUrl);
  return data;
};

const create = async (newEntry) => {
  const { data } = await axios.post(baseUrl, newEntry);
  return data;
};

const remove = async (id) => {
  const { data } = await axios.delete(`${baseUrl}/${id}`);
  return data;
};

const update = async (id, newEntry) => {
  const { data } = await axios.put(`${baseUrl}/${id}`, newEntry);
  return data;
};

export default { getAll, create, remove, update };
