import Part from "./Part";
import { ContentProps } from "./types";

const Content = ({ courseParts }: ContentProps) => {
  return courseParts.map((part) => <Part key={part.name} part={part} />);
};

export default Content;
