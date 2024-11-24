import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import anecdoteService from "../services/anecdotes.js";
import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import {
  setNewNotification,
  useNotificationDispatchAndRef,
} from "./context/NotificationContext.jsx";

const App = () => {
  const result = useQuery({
    queryKey: ["anecdotes"],
    queryFn: anecdoteService.getAll,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const [dispatch, ref] = useNotificationDispatchAndRef();

  const queryClient = useQueryClient();
  const voteMutation = useMutation({
    mutationFn: anecdoteService.vote,
    onSuccess: (upvotedAnecdote) => {
      const data = queryClient.getQueryData(["anecdotes"]);
      queryClient.setQueryData(
        ["anecdotes"],
        data.map((anecdote) =>
          anecdote.id === upvotedAnecdote.id
            ? { ...anecdote, votes: anecdote.votes + 1 }
            : anecdote
        )
      );
      setNewNotification(
        dispatch,
        `Voted for anecdote "${upvotedAnecdote.content}"`,
        ref
      );
    },
  });

  if (result.isLoading) {
    return <div>Loading anecdotes...</div>;
  }

  if (result.isError) {
    return <div>Anecdote service not available due to problems in server.</div>;
  }

  const { data: anecdotes } = result;

  const handleVote = (anecdote) => {
    voteMutation.mutate(anecdote);
  };

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
