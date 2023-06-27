const { google } = require("googleapis");
import { API_KEY } from "./API_KEY.env"
const books = google.books({
  version: "v1",
  auth: API_KEY,
});

function searchBooks(query, callback) {
  books.volumes.list(
    {
      q: query,
    },
    (err, res) => {
      if (err) {
        console.error(err);
        return;
      }
      const items = res.data.items || [];
      if (items.length === 0) {
        console.log("No books found.");
        return;
      }
      const books = res.data.items.map((item) => ({
        id: item.id,
        title: item.volumeInfo.title,
        author:
          item.volumeInfo.authors && item.volumeInfo.authors.length >= 2
            ? item.volumeInfo.authors.join(", ")
            : item.volumeInfo.authors
            ? item.volumeInfo.authors[0]
            : "Unknown author",
        description: item.volumeInfo.description,
        publishedDate: item.volumeInfo.publishedDate,
        thumbnail: item.volumeInfo.imageLinks
          ? item.volumeInfo.imageLinks.thumbnail
          : null,
      }));

      callback(books);
    }
  );
}

function searchBookById(id, callback) {
  books.volumes.get(
    {
      volumeId: id,
    },
    (err, res) => {
      if (err) {
        console.error(err);
        return;
      }
      const book = {
        id: res.data.id,
        title: res.data.volumeInfo.title,
        author:
          res.data.volumeInfo.authors && res.data.volumeInfo.authors.length >= 2
            ? res.data.volumeInfo.authors.join(", ")
            : res.data.volumeInfo.authors
            ? res.data.volumeInfo.authors[0]
            : "Unknown author",
        description: res.data.volumeInfo.description,
        publishedDate: res.data.volumeInfo.publishedDate,
        thumbnail: res.data.volumeInfo.imageLinks
          ? res.data.volumeInfo.imageLinks.thumbnail
          : null,
      };
      callback(book);
    }
  );
}

module.exports = {
  searchBooks: searchBooks,
  searchBookById: searchBookById,
};
