import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import 'normalize.css';
import Book from './Book';
import Suggestion from './Suggestion';

const App = () => {
  const inputRef = useRef();
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState(['26156469']);
  const [timeoutId, setTimeoutId] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionIndex, setSuggestionIndex] = useState(-1);
  useEffect(() => {
    if (query.length > 0) {
      clearTimeout(timeoutId);
      setTimeoutId(
        setTimeout(() => {
          fetch(
            `https://us-central1-woven-grail-231507.cloudfunctions.net/goodreads?action=suggest&query=${query}`
          )
            .then(data => data.json())
            .then(json => {
              setSuggestions(json.results);
              setTimeoutId(null);
            });
        }, 200)
      );
    }
  }, [query]);
  return (
    <div>
      <h1>To read list</h1>
      <form
        onSubmit={e => {
          if (suggestionIndex > -1) {
            inputRef.current.value = '';
            setBooks(books.concat([suggestions[suggestionIndex].id]));
          }
          e.preventDefault();
        }}
      >
        <p>
          Add a book:
          <input
            tabIndex="0"
            type="text"
            ref={inputRef}
            onKeyDown={e => {
              if (e.keyCode === 9) {
                // cycle thru suggestions, copying text
                if (suggestions.length > 0) {
                  let newIndex = suggestionIndex + 1;
                  if (newIndex > suggestions.length - 1) {
                    newIndex = 0;
                  }
                  inputRef.current.value = suggestions[newIndex].text;
                  setSuggestionIndex(newIndex);
                }
                e.preventDefault();
              }
            }}
            onChange={e => {
              setQuery(e.target.value);
              setSuggestionIndex(-1);
            }}
          />
          <button type="submit">Add</button>
        </p>
      </form>

      {suggestions.map(book => (
        <Suggestion
          key={book.id}
          book={book}
          addBook={goodreadsId => {
            inputRef.current.value = '';
            setBooks(books.concat([goodreadsId]));
          }}
        />
      ))}

      {books.map(goodreadsId => (
        <Book key={goodreadsId} goodreadsId={goodreadsId} />
      ))}
    </div>
  );
};

export default App;
