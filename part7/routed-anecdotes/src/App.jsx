import { useState } from "react";
import { Link, Route, Routes, useMatch, useNavigate } from "react-router-dom";
import { useField } from "./hooks";

const Menu = () => {
  const padding = {
    paddingRight: 5,
  };

  return (
    <div>
      <Link to="/" style={padding}>
        Anecdotes
      </Link>
      <Link to="/create" style={padding}>
        Create new
      </Link>
      <Link to="/about" style={padding}>
        About
      </Link>
    </div>
  );
};

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map((anecdote) => (
        <Link key={anecdote.id} to={`/anecdotes/${anecdote.id}`}>
          <li>{anecdote.content}</li>
        </Link>
      ))}
    </ul>
  </div>
);

const Anecdote = ({ anecdote: { content, author, info, votes } }) => (
  <div>
    <h2>
      {`"${content}." -- `}
      <em>{author}</em>
    </h2>
    <p>has {votes} votes</p>
    <p>
      for more info see <a href={`${info}`}>{info}</a>
    </p>
  </div>
);

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>
      An anecdote is a brief, revealing account of an individual person or an
      incident. Occasionally humorous, anecdotes differ from jokes because their
      primary purpose is not simply to provoke laughter but to reveal a truth
      more general than the brief tale itself, such as to characterize a person
      by delineating a specific quirk or trait, to communicate an abstract idea
      about a person, place, or thing through the concrete details of a short
      narrative. An anecdote is &quot;a story with a point.&quot;
    </em>

    <p>
      Software engineering is full of excellent anecdotes, at this app you can
      find the best and add more.
    </p>
  </div>
);

const Footer = () => (
  <div>
    Anecdote app for <a href="https://fullstackopen.com/">Full Stack Open</a>.
    See{" "}
    <a href="https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js">
      https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js
    </a>{" "}
    for the source code.
  </div>
);

const CreateNew = (props) => {
  const [content, contentReset] = useField("content");
  const [author, authorReset] = useField("author");
  const [info, infoReset] = useField("info");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    props.addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0,
    });
    navigate("/");
  };

  const handleReset = () => {
    [contentReset, authorReset, infoReset].forEach((it) => it());
  };

  return (
    <div>
      <h2>Create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          Content
          <input {...content} />
        </div>
        <div>
          Author
          <input {...author} />
        </div>
        <div>
          Url for more info
          <input {...info} />
        </div>
        <button type="submit">Create</button>
        <button type="button" onClick={handleReset}>
          Reset
        </button>
      </form>
    </div>
  );
};

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: "If it hurts, do it more often",
      author: "Jez Humble",
      info: "https://martinfowler.com/bliki/FrequencyReducesDifficulty.html",
      votes: 0,
      id: 1,
    },
    {
      content: "Premature optimization is the root of all evil",
      author: "Donald Knuth",
      info: "http://wiki.c2.com/?PrematureOptimization",
      votes: 0,
      id: 2,
    },
  ]);

  const [notification, setNotification] = useState("");

  const handleNotification = (notif) => {
    setNotification(notif);
    setTimeout(() => {
      setNotification("");
    }, 5000);
  };

  const anecdoteById = (id) => anecdotes.find((a) => a.id === id);

  const match = useMatch("/anecdotes/:id");
  const matchedAnecdote = match ? anecdoteById(Number(match.params.id)) : null;

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000);
    setAnecdotes(anecdotes.concat(anecdote));
    handleNotification(`Created anecdote "${anecdote.content}"`);
  };
  /* -- unused in this version
  const vote = (id) => {
    const anecdote = anecdoteById(id);

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1,
    };

    setAnecdotes(anecdotes.map((a) => (a.id === id ? voted : a)));
  };*/

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu />
      {notification && <p>{notification}</p>}
      <Routes>
        <Route
          path="/anecdotes/:id"
          element={<Anecdote anecdote={matchedAnecdote} />}
        />
        <Route path="/about" element={<About />} />
        <Route path="/create" element={<CreateNew addNew={addNew} />} />
        <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
