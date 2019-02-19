import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const Li = styled.li`
  color: black;
  list-style: none;
`;

const LoadKeyFrames = keyframes`
  0%,
  80%,
  100% {
    box-shadow: 0 0;
    height: 4em;
  }
  40% {
    box-shadow: 0 -2em;
    height: 5em;
  }
`;

const Loader = styled.div`
  &,
  &:before,
  &:after {
    background: #000000;
    -webkit-animation: ${LoadKeyFrames} 1s infinite ease-in-out;
    animation: ${LoadKeyFrames} 1s infinite ease-in-out;
    width: 1em;
    height: 4em;
  }
  & {
    color: #000000;
    text-indent: -9999em;
    margin: 88px auto;
    position: relative;
    font-size: 11px;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
  }
  &:before,
  &:after {
    position: absolute;
    top: 0;
    content: '';
  }
  &:before {
    left: -1.5em;
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
  }
  &:after {
    left: 1.5em;
  }
`;

const Book = ({ goodreadsId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [book, setBook] = useState({});
  useEffect(() => {
    fetch(
      `https://us-central1-woven-grail-231507.cloudfunctions.net/goodreads?action=get_book&id=${goodreadsId}`
    )
      .then(data => data.json())
      .then(json => {
        setBook(json);
        setIsLoading(false);
      });
  }, [goodreadsId]);

  if (isLoading) {
    return (
      <div style={{ width: '300px' }}>
        <Loader />
      </div>
    );
  }
  return (
    <Li>
      <p>{book.title}</p>
      <p>by {book.author}</p>
      <a href={book.link}>link</a>
    </Li>
  );
};

export default Book;
