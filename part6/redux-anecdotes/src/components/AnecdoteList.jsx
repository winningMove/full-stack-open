import { useDispatch, useSelector } from "react-redux";
import { addVote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const AnecdoteList = ({ notificationResetRef }) => {
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    const sorted = anecdotes.toSorted((a, b) => b.votes - a.votes);
    return filter
      ? sorted.filter((anecdote) =>
          anecdote.content.toLowerCase().includes(filter.toLowerCase())
        )
      : sorted;
  });
  const dispatch = useDispatch();

  const handleVote = (anecdote) => {
    dispatch(addVote(anecdote));
    dispatch(
      setNotification(
        `Voted for "${anecdote.content}"`,
        5,
        notificationResetRef
      )
    );
  };

  return anecdotes.map((anecdote) => (
    <div key={anecdote.id}>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={() => handleVote(anecdote)}>vote</button>
      </div>
    </div>
  ));
};

export default AnecdoteList;
