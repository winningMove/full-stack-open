import { DiaryEntry } from "./types";

const Entries = ({ diaryEntries }: { diaryEntries: DiaryEntry[] }) => {
  if (!diaryEntries.length) return <div>No diary entries yet. Add one!</div>;

  return (
    <div>
      <h2>Diary Entries</h2>
      {diaryEntries.map((entry) => (
        <Entry key={entry.id} entry={entry} />
      ))}
    </div>
  );
};

const Entry = ({ entry }: { entry: DiaryEntry }) => {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <h3>{entry.date}</h3>
      <p style={{ margin: "5px 0" }}>visibility: {entry.visibility}</p>
      <p style={{ margin: "5px 0" }}>weather: {entry.weather}</p>
    </div>
  );
};

export default Entries;
