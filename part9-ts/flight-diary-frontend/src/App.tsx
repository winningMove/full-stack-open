import { useEffect, useRef, useState } from "react";
import { DiaryEntry } from "./types";
import diaryService from "../services/diaryService";
import Entries from "./Entries";
import Error from "./Error";
import { isAxiosError } from "axios";
import AddEntry from "./AddEntry";

const App = () => {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [error, setError] = useState<string>("");
  const errTimeoutRef = useRef<number>();

  useEffect(() => {
    async function fetchEntries() {
      try {
        const entries = await diaryService.getAll();
        setDiaryEntries(entries);
      } catch (err) {
        if (isAxiosError(err)) {
          setError(`${err.response?.data || err.message}`);
        } else {
          setError("Unexpected error occurred");
        }
        clearTimeout(errTimeoutRef.current);
        errTimeoutRef.current = setTimeout(() => {
          setError("");
        }, 5000);
      }
    }

    fetchEntries();
  }, []);

  return (
    <div>
      <Error error={error} />
      <AddEntry
        errTimeoutRef={errTimeoutRef}
        setDiaryEntries={setDiaryEntries}
        setError={setError}
      />
      <Entries diaryEntries={diaryEntries} />
    </div>
  );
};

export default App;
