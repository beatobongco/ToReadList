import React from 'react';
import styled from 'styled-components';

const _Suggestions = styled.div`
  position: absolute;
  background-color: white;
  border: 1px solid black;
`;

const _Suggestion = styled.li`
  list-style: none;
  background-color: ${props => (props.selected ? 'blue' : 'white')};
`;

const Suggestion = ({ book, addBook, selected }) => (
  <_Suggestion
    selected={selected}
    onClick={() => {
      addBook(book.id);
    }}
  >
    {book.text}
  </_Suggestion>
);

const Suggestions = ({ selectedIndex, items, addBook }) => {
  if (items.length > 0) {
    return (
      <_Suggestions>
        {items.map((book, index) => (
          <Suggestion
            key={book.id}
            selected={index === selectedIndex}
            book={book}
            addBook={addBook}
          />
        ))}
      </_Suggestions>
    );
  }
  return null;
};

export default Suggestions;
