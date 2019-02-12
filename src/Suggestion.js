import React from 'react';

const Suggestion = ({ book, addBook }) => (
  <li
    onClick={() => {
      addBook(book.id);
    }}
  >
    {book.text}
  </li>
);

export default Suggestion;
