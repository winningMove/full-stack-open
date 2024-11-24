import { useMutation, useQueryClient } from "@tanstack/react-query";
import anecdoteService from "../../services/anecdotes.js";
import {
  setNewNotification,
  useNotificationDispatchAndRef,
} from "../context/NotificationContext.jsx";

const AnecdoteForm = () => {
  const queryClient = useQueryClient();
  const [dispatch, ref] = useNotificationDispatchAndRef();

  const newAnecdoteMutation = useMutation({
    mutationFn: anecdoteService.createNew,
    onSuccess: (newAnecdote) => {
      const data = queryClient.getQueryData(["anecdotes"]);
      queryClient.setQueryData(["anecdotes"], [...data, newAnecdote]);
      setNewNotification(
        dispatch,
        `Created anecdote "${newAnecdote.content}"`,
        ref
      );
    },
    onError: () => {
      setNewNotification(
        dispatch,
        "Anecdote too short to add, must be 5 characters or longer",
        ref
      );
    },
  });

  const onCreate = (e) => {
    e.preventDefault();
    newAnecdoteMutation.mutate(e.target.anecdote.value);
    e.target.anecdote.value = "";
  };

  return (
    <div>
      <h3>Create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
