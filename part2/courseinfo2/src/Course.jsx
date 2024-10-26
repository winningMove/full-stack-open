const Header = ({ course }) => <h2>{course}</h2>;

const Total = ({ sum }) => (
  <p>
    <strong>total of {sum} exercises</strong>
  </p>
);

const Part = ({ part: { name, exercises } }) => (
  <p>
    {name} {exercises}
  </p>
);

const Content = ({ parts }) =>
  parts.map(({ id, ...part }) => <Part key={id} part={part} />);

const Course = ({ course: { name, parts } }) => {
  const totalExercises = parts.reduce(
    (acc, { exercises }) => acc + exercises,
    0
  );
  return (
    <>
      <Header course={name} />
      <Content parts={parts} />
      <Total sum={totalExercises} />
    </>
  );
};

export default Course;
