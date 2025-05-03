import { PartProps } from "./types";

const Part = ({ part }: PartProps) => {
  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  const divStyle = { marginBottom: "20px" };
  const pStyle = { margin: "4px 0" };

  switch (part.kind) {
    case "basic":
      return (
        <div style={divStyle}>
          <p style={pStyle}>
            <strong>
              {part.name} {part.exerciseCount}
            </strong>
          </p>
          <p style={pStyle}>
            <em>{part.description}</em>
          </p>
        </div>
      );
    case "group":
      return (
        <div style={divStyle}>
          <p style={pStyle}>
            <strong>
              {part.name} {part.exerciseCount}
            </strong>
          </p>
          <p style={pStyle}>Group projects: {part.groupProjectCount}</p>
        </div>
      );
    case "background":
      return (
        <div style={divStyle}>
          <p style={pStyle}>
            <strong>
              {part.name} {part.exerciseCount}
            </strong>
          </p>
          <p style={pStyle}>
            <em>{part.description}</em>
          </p>
          <p style={pStyle}>{part.backgroundMaterial}</p>
        </div>
      );
    case "special":
      return (
        <div style={divStyle}>
          <p style={pStyle}>
            <strong>
              {part.name} {part.exerciseCount}
            </strong>
          </p>
          <p style={pStyle}>
            <em>{part.description}</em>
          </p>
          <p style={pStyle}>Required skills: {part.requirements.join(", ")}</p>
        </div>
      );
    default:
      return assertNever(part);
  }
};

export default Part;
