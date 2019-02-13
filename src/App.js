import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import 'normalize.css';
import Book from './Book';
import Suggestion from './Suggestion';

// TODO: add firebase for persistence then release

const App = () => {
  const inputRef = useRef();
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState(['26156469']);
  const [suggestions, setSuggestions] = useState({
    index: -1,
    timeoutId: null,
    items: []
  });
  const { index, items, timeoutId } = suggestions;
  const addBook = goodreadsId => {
    inputRef.current.value = '';
    if (books.indexOf(goodreadsId) === -1) {
      setBooks(books.concat([goodreadsId]));
    }
  };
  const onTab = e => {
    if (e.keyCode === 9) {
      // cycle thru suggestions, copying text
      if (items.length > 0) {
        let newIndex = index + 1;
        if (newIndex > items.length - 1) {
          newIndex = 0;
        }
        inputRef.current.value = items[newIndex].text;
        setSuggestions({ ...suggestions, index: newIndex });
      }
      e.preventDefault();
    }
  };
  useEffect(() => {
    if (query.length > 0) {
      clearTimeout(timeoutId);
      setSuggestions({
        ...suggestions,
        timeoutId: setTimeout(() => {
          fetch(
            `https://us-central1-woven-grail-231507.cloudfunctions.net/goodreads?action=suggest&query=${query}`
          )
            .then(data => data.json())
            .then(json => {
              setSuggestions({
                ...suggestions,
                items: json.results,
                timeoutId: null
              });
            });
        }, 200)
      });
    }
  }, [query]);
  return (
    <div>
      <h1>To read list</h1>
      <form
        onSubmit={e => {
          if (index > -1) {
            addBook(items[index].id);
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
            onKeyDown={onTab}
            onChange={e => {
              setQuery(e.target.value);
              setSuggestions({ ...suggestions, index: -1 });
            }}
          />
          <button type="submit">Add</button>
        </p>
      </form>

      {items.map(book => (
        <Suggestion key={book.id} book={book} addBook={addBook} />
      ))}

      {books.map(goodreadsId => (
        <Book key={goodreadsId} goodreadsId={goodreadsId} />
      ))}
    </div>
  );
};

export default App;
