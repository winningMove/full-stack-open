import axios from "axios";
import { DiaryEntry, NewEntry } from "../src/types";

const baseUrl = `http://localhost:3000/api/diaries`;

const getAll = async (): Promise<DiaryEntry[]> => {
  const { data } = await axios.get<DiaryEntry[]>(baseUrl);
  return data;
};

const addNewEntry = async (entry: NewEntry): Promise<DiaryEntry> => {
  const { data } = await axios.post<DiaryEntry>(baseUrl, entry);
  return data;
};

export default { getAll, addNewEntry };
