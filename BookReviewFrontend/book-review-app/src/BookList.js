import React from "react";
import BookCard from "./BookCard";

const BookList = (props) => {
  const handleReview = (review) => {
    props.sendReview(review);
  };
  console.log(props.books);
  return (
    <div className="list">
      {props.books.map((book, index) => {
        return (
          <BookCard
            title={book.title}
            author={book.author}
            published={book.publishedDate}
            image={book.thumbnail}
            key={book.id ? book.id : book.book_id}
            book_id={book.id ? book.id : book.book_id}
            description={book.description}
            reviews={book.rating ? book.rating : null}
            comments={book.comments}
            commentTitle={book.reviewTitle}
            userID={book.user_id}
            handleReview={handleReview}
          />
        );
      })}
    </div>
  );
};

export default BookList;
