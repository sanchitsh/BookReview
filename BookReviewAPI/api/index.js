const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const books = require("./books");
const database = require("./database");
const db = database.db;
const app = express();

// adding Helmet for API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

//CORS enabled for all origins
app.use(cors());

//Morgan for logging
app.use(morgan("combined"));

//Health check endpoint
app.get("/health", (req, res) => {
  //return 200 if the service is up
  res.status(200).send("OK");
});
//Endpoint to look up a book
app.get("/books/search", (req, res) => {
  const query = req.query.q;

  books.searchBooks(query, (books) => {
    res.json(books);
  });
});
//Endpoint to add a book review
app.post("/book-reviews/review", (req, res) => {
  const { bookId, reviewTitle, reviewText, rating, userId } = req.body;
  const review = { bookId, reviewTitle, reviewText, rating, userId };
  database.addReview(review, (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Server error");
      return;
    }
    res.status(200).send("OK");
  });
});

//Endpoint to get all reviews for a user
app.get("/book-reviews/user/:userId", (req, res) => {
  const userId = req.params.userId;

  database.getReviewsByUserId(userId, (err, reviews) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Server error");
      return;
    }
    if (reviews.length === 0) {
      res.status(404).send("Not found");
      return;
    }
    res.json(reviews);
  });
});
//Endpoint to get all reviews
app.get("/book-reviews", (req, res) => {
  database.getAllBookReviews((err, reviews) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Server error");
      return;
    }

    res.json(reviews);
  });
});
//Endpoint to get a book by id
app.get("/bookOne/:bookId", (req, res) => {
  const bookId = req.params.bookId;
  //return 400 if book id is not provided
  if (!bookId) {
    res.status(400).send("Book id not provided");
    return;
  }
  books.searchBookById(bookId, (book) => {
    //return 404 if book is not found
    if (!book) {
      res.status(404).send("Not found");
      return;
    }
    //return the book
    res.json(book);
  });
});

//Endpoint to get all reviews for a book
app.get("/book-reviews/:bookId", (req, res) => {
  const bookId = req.params.bookId;

  database.getReviewsByBookId(bookId, (err, reviews) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Server error");
      return;
    }
    if (reviews.length === 0) {
      res.status(404).send("Not found");
      return;
    }
    res.json(reviews);
  });
});

//start at port 3000
app.listen(3001, () => {
  console.log("listening on port 3001");
});
