import { useDispatch } from "react-redux";
import { createNew } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const AnecdoteForm = ({ notificationResetRef }) => {
  const dispatch = useDispatch();
  const add = (e) => {
    e.preventDefault();

    dispatch(createNew(e.target.anecdote.value));
    dispatch(
      setNotification(
        `Added anecdote "${e.target.anecdote.value}"`,
        5,
        notificationResetRef
      )
    );

    e.target.anecdote.value = "";
  };

  return (
    <>
      <h2>Add new anecdote</h2>
      <form onSubmit={add}>
        <div>
          <input type="text" name="anecdote" />
        </div>
        <button type="submit">Add</button>
      </form>
    </>
  );
};

export default AnecdoteForm;
