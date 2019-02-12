import React, { useState, useEffect } from 'react';

const Book = ({ goodreadsId }) => {
  const [book, setBook] = useState({});
  useEffect(() => {
    fetch(
      `https://us-central1-woven-grail-231507.cloudfunctions.net/goodreads?action=get_book&id=${goodreadsId}`
    )
      .then(data => data.json())
      .then(json => {
        setBook(json);
      });
  }, [goodreadsId]);
  return (
    <li>
      <p>{book.title}</p>
      <p>by {book.author}</p>
      <a href={book.link}>link</a>
    </li>
  );
};

export default Book;
