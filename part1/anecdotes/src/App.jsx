import { useRef, useState } from "react";

const Quote = ({ title, anecdote, votes }) => {
  return (
    <section>
      <h1>{title}</h1>
      <p>{anecdote}</p>
      <p>has {votes} votes</p>
    </section>
  );
};

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const getRandomQuoteIndex = () => {
    return Math.floor(Math.random() * anecdotes.length);
  };

  const [selected, setSelected] = useState(getRandomQuoteIndex());
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0));
  const highestVotesIndex = useRef(selected);

  const handleVoteClick = () => {
    const newVotes = [...votes];
    newVotes[selected]++;
    setVotes(newVotes);

    if (newVotes[selected] >= newVotes[highestVotesIndex.current]) {
      highestVotesIndex.current = selected;
    }
  };

  const handleNextClick = () => {
    let next = getRandomQuoteIndex();
    while (next === selected) next = getRandomQuoteIndex();
    setSelected(next);
  };

  return (
    <>
      <Quote
        title="Anecdote of the Day"
        anecdote={anecdotes[selected]}
        votes={votes[selected]}
      />
      <button onClick={handleVoteClick}>Vote</button>
      <button onClick={handleNextClick}>Next anecdote</button>
      {votes[highestVotesIndex.current] ? (
        <Quote
          title="Anecdote with Most Votes"
          anecdote={anecdotes[highestVotesIndex.current]}
          votes={votes[highestVotesIndex.current]}
        />
      ) : (
        <p>No votes yet</p>
      )}
    </>
  );
};

export default App;
