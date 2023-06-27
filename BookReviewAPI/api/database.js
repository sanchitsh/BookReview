const sqlite3 = require("sqlite3").verbose();
const books = require("./books");
const db = new sqlite3.Database("./my-database.sqlite");

//Create a table for book reviews
db.run(`
    CREATE TABLE IF NOT EXISTS book_reviews (
        user_id TEXT,
        book_id TEXT,
        reviewTitle TEXT,
        comments TEXT,
        rating INTEGER,
        percentRead INTEGER,
        username TEXT
    )
`);
db.run(
  "CREATE INDEX IF NOT EXISTS reviews_book_id_index ON book_reviews (book_id)"
);
function getAllBookReviews(callback) {
  db.all(
    `
    SELECT *
    FROM book_reviews
  `,
    (err, rows) => {
      if (err) {
        console.error(err.message);
        callback(err);
        return;
      }

      callback(null, rows);
    }
  );
}

function getReviewsByBookId(bookId, callback) {
  db.all(
    `
    SELECT *
    FROM book_reviews
    WHERE book_id = ?
  `,
    [bookId],
    (err, rows) => {
      if (err) {
        console.error(err.message);
        callback(err);
        return;
      }
      // Only calculate average rating if there are reviews
      if (rows.length > 0) {
        let totalRating = 0;
        rows.forEach((row) => {
          totalRating += row.rating;
        });
        const averageRating = totalRating / rows.length;
        rows.forEach((row) => {
          row.averageRating = averageRating;
        });
      }
      callback(null, rows);
    }
  );
}

//Function to get all reviews for a user
function getReviewsByUserId(userId, callback) {
  db.all(
    `
      SELECT *
      FROM book_reviews
      WHERE user_id = ?
    `,
    [userId],
    (err, rows) => {
      if (err) {
        console.error(err.message);
        callback(err);
        return;
      }
      //return 404 if no reviews found
      if (rows.length === 0) {
        callback(null, []);
        return;
      }
      //Remove repeated book reviews
      const uniqueBookIds = [...new Set(rows.map((row) => row.book_id))];
      const uniqueReviews = [];
      uniqueBookIds.forEach((bookId) => {
        uniqueReviews.push(rows.find((row) => row.book_id === bookId));
      });
      if (uniqueReviews.length === 0) {
        callback(null, []);
        return;
      }
      callback(null, uniqueReviews);
    }
  );
}

function addReview(review, callback) {
  const { bookId, reviewTitle, reviewText, rating, userId } = review;
  //If user id or book id does not exist, return 400
  if (!userId || !bookId) {
    callback(new Error("User id or book id not provided"));
    return;
  }

  // Check if review for the same book id and user id already exists
  db.get(
    `
      SELECT *
      FROM book_reviews
      WHERE book_id = ? AND user_id = ?
    `,
    [bookId, userId],
    (err, row) => {
      if (err) {
        console.error(err.message);
        callback(err);
        return;
      }

      if (row) {
        // Review already exists, update it
        db.run(
          `
          UPDATE book_reviews
          SET reviewTitle = ?, comments = ?, rating = ?
          WHERE book_id = ? AND user_id = ?
        `,
          [reviewTitle, reviewText, rating, bookId, userId],
          (err) => {
            if (err) {
              console.error(err.message);
              callback(err);
              return;
            }
            callback(null, review);
          }
        );
      } else {
        // Review does not exist, insert it
        db.run(
          `
          INSERT INTO book_reviews (book_id, reviewTitle, comments, rating, user_id)
          VALUES (?, ?, ?, ?, ?)
        `,
          [bookId, reviewTitle, reviewText, rating, userId],
          (err) => {
            if (err) {
              console.error(err.message);
              callback(err);
              return;
            }
            callback(null, review);
          }
        );
      }
    }
  );
}

module.exports = {
  getReviewsByBookId: getReviewsByBookId,
  getAllBookReviews: getAllBookReviews,
  getReviewsByUserId: getReviewsByUserId,
  addReview: addReview,
};
