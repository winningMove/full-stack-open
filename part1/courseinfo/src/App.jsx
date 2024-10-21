const Header = ({ courseName }) => {
  return <h1>{courseName}</h1>;
};

const Content = ({ parts }) => {
  return parts.map((part, i) => <Part key={i} part={part} />);
};

const Part = ({ part: { name, exercises } }) => {
  return (
    <p>
      {name} {exercises}
    </p>
  );
};

const Total = ({ parts }) => {
  const exerciseTotal = parts.reduce((acc, el) => acc + el.exercises, 0);
  return <p>Number of exercises {exerciseTotal}</p>;
};

const App = () => {
  const { name, parts } = {
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
      },
      {
        name: "State of a component",
        exercises: 14,
      },
    ],
  };

  return (
    <div>
      <Header courseName={name} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  );
};

export default App;
