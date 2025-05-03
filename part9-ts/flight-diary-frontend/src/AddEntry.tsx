import { isAxiosError } from "axios";
import { useState } from "react";
import diaryService from "../services/diaryService";
import { AddEntryProps, Visibility, Weather } from "./types";

const AddEntry = ({
  errTimeoutRef,
  setError,
  setDiaryEntries,
}: AddEntryProps) => {
  const [date, setDate] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Good);
  const [weather, setWeather] = useState<Weather>(Weather.Sunny);

  const submit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const data = await diaryService.addNewEntry({
        date,
        weather,
        visibility,
        comment,
      });
      setDiaryEntries((prev) => [...prev, data]);
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
    } finally {
      setComment("");
      setDate("");
      setVisibility(Visibility.Good);
      setWeather(Weather.Sunny);
    }
  };

  return (
    <div>
      <h2>Add new entry</h2>
      <form onSubmit={submit}>
        <div>
          <label>
            Date:{" "}
            <input
              type="date"
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Visibility:{" "}
            {Object.values(Visibility).map((v) => (
              <label key={v}>
                <input
                  type="radio"
                  name="visibility"
                  value={v}
                  checked={visibility === v}
                  onChange={(e) => setVisibility(e.target.value as Visibility)}
                />{" "}
                {v}
              </label>
            ))}
          </label>
        </div>
        <div>
          <label>
            Weather:{" "}
            {Object.values(Weather).map((v) => (
              <label key={v}>
                <input
                  type="radio"
                  name="weather"
                  value={v}
                  checked={weather === v}
                  onChange={(e) => setWeather(e.target.value as Weather)}
                />{" "}
                {v}
              </label>
            ))}
          </label>
        </div>
        <div>
          <label>
            Comment:{" "}
            <input
              name="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </label>
        </div>

        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddEntry;
