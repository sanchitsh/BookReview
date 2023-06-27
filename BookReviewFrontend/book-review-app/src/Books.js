import React, { Component } from "react";
import LookUpArea from "./LookUpArea";
import BookList from "./BookList";
class Books extends Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      search: "",
      selectedBook: null,
      userID: "",
    };
  }
  askForBooks = (e) => {
    e.preventDefault();
    fetch(`http://localhost:3001/books/search?q=${this.state.search}`)
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          books: json,
        });
        // For each book, get the reviews
        this.state.books.forEach((book) => {
          fetch(`http://localhost:3001/book-reviews/${book.id}`)
            .then((res) => res.json())
            .then((json) => {
              book.reviews = json;
              this.setState({
                books: this.state.books,
              });
            })

            .catch((error) => {
              console.warn(
                `Error fetching reviews for book ${book.id}: ${error}`
              );
            });
        });
      })
      .catch((error) => {
        console.warn(`Error fetching books: ${error}`);
      });
  };
  handleQuery = (event) => {
    this.setState({
      search: event.target.value,
    });
  };
  checkReviews = (event) => {
    fetch(`http://localhost:3001/books/search?q=${this.state.search}`)
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          books: json,
        });
      });
  };
  sendReview = (review) => {
    console.log(review);
    //review contains  title: reviewTitle, text: reviewText,rating: reviewRating,user: reviewUserID,
    //Send post /book-reviews/review with review fields
    fetch(`http://localhost:3001/book-reviews/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      //review needs to be like :  const { bookId, reviewTitle, reviewText, rating, userId } = req.body;
      body: JSON.stringify(review),
    }).then((res) => {
      if (res.status === 200) {
        alert("Review submitted successfully");
      } else {
        alert("Error submitting review");
      }
    });
  };
  handleIDQuery = (event) => {
    this.setState({
      userID: event.target.value,
    });
  };
  askForUserBooks = (e) => {
    e.preventDefault();
    fetch(`http://localhost:3001/book-reviews/user/${this.state.userID}`)
      .then((res) => res.json())
      .then((json) => {
        // Check if json is empty
        if (json.length === 0) {
          console.warn("No books found for user");
          // Clear the books array in state
          this.setState({ books: [] });
          // Update the UI with empty books array
          return;
        }

        // Create an array of promises for all the book fetch requests
        const bookFetchPromises = json.map((book) => {
          return fetch(`http://localhost:3001/bookOne/${book.book_id}`)
            .then((res) => res.json())
            .then((json) => {
              book.title = json.title;
              book.author = json.author;
              book.publishedDate = json.publishedDate;
              book.thumbnail = json.thumbnail;
              book.description = json.description;
              return book;
            })
            .catch((error) => {
              console.warn(`Error fetching books for user: ${error}`);
            });
        });

        // Wait for all the book fetch requests to complete
        Promise.all(bookFetchPromises)
          .then((books) => {
            // Update the state with the updated books
            this.setState({
              books: books,
            });
            // Update the UI with the updated books array
          })
          .catch((error) => {
            console.warn(`Error fetching books for user: ${error}`);
          });
      })
      .catch((error) => {
        console.warn(`Error fetching books for user: ${error}`);
      });
  };

  render() {
    return (
      <div>
        <LookUpArea
          askForBooks={this.askForBooks}
          handleQuery={this.handleQuery}
          askuserID={this.askForUserBooks}
          handleIDQuery={this.handleIDQuery}
        />
        <BookList
          books={this.state.books}
          sendReview={(review) => this.sendReview(review)}
        />
      </div>
    );
  }
}

export default Books;
