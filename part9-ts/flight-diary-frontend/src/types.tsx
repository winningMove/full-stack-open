import React from "react";

export interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
}

export interface NewEntry extends Omit<DiaryEntry, "id"> {
  comment: string;
}

export enum Weather {
  Sunny = "sunny",
  Rainy = "rainy",
  Cloudy = "cloudy",
  Stormy = "stormy",
  Windy = "windy",
}

export enum Visibility {
  Great = "great",
  Good = "good",
  Ok = "ok",
  Poor = "poor",
}

export interface AddEntryProps {
  errTimeoutRef: React.MutableRefObject<number | undefined>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setDiaryEntries: React.Dispatch<React.SetStateAction<DiaryEntry[]>>;
}
