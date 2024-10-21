import { useState } from "react";

const Button = ({ name, handleClick }) => {
  return <button onClick={handleClick}>{name}</button>;
};

const Feedback = ({ buttons }) => {
  return Object.entries(buttons).map(([k, v], i) => (
    <Button key={i} name={k} handleClick={v} />
  ));
};

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{text !== "positive" ? value : value + " %"}</td>
    </tr>
  );
};

const Statistics = ({ good, neutral, bad }) => {
  const formatFloat = (n) => (n % 1 !== 0 ? n.toFixed(1) : n);

  const all = good + neutral + bad;
  const average = formatFloat((good - bad) / all);
  let positive = formatFloat((good / all) * 100);

  const stats = { good, neutral, bad, all, average, positive };

  return (
    <table>
      <thead>
        <tr>
          <th>Stat</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(stats).map(([k, v], i) => (
          <StatisticLine key={i} text={k} value={v} />
        ))}
      </tbody>
    </table>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const buttons = {
    good: () => {
      setGood(good + 1);
    },
    neutral: () => {
      setNeutral(neutral + 1);
    },
    bad: () => {
      setBad(bad + 1);
    },
  };

  return (
    <>
      <h1>Give Feedback</h1>
      <Feedback buttons={buttons} />
      <h1>Statistics</h1>
      {good || neutral || bad ? (
        <Statistics good={good} neutral={neutral} bad={bad} />
      ) : (
        "No feedback given"
      )}
    </>
  );
};

export default App;
