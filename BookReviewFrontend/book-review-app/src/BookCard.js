import React, { useState } from "react";

const BookCard = (props) => {
  const grayTextStyle = { color: "grey" };
  const goldStarStyle = { color: "gold" };
  const greyStarStyle = { color: "lightgrey" };
  const [reviewVisible, setReviewVisible] = useState(false);
  const [reviewText, setReviewText] = useState(
    props.comments ? props.comments : ""
  );
  const [reviewTitle, setReviewTitle] = useState(
    props.commentTitle ? props.commentTitle : ""
  );
  const [reviewUserID, setReviewUserID] = useState(
    props.userID ? props.userID : ""
  );
  const [reviewRating, setReviewRating] = useState(
    props.reviews ? props.reviews : 0
  );

  const renderStars = () => {
    const stars = [];
    const rating = reviewRating ? reviewRating : props.reviews;
    if (rating !== null) {
      for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
          stars.push(
            <span key={i} className="fa fa-star" style={goldStarStyle}></span>
          );
        } else {
          stars.push(
            <span key={i} className="fa fa-star" style={greyStarStyle}></span>
          );
        }
      }
    } else {
      for (let i = 1; i <= 5; i++) {
        stars.push(
          <span key={i} className="fa fa-star" style={greyStarStyle}></span>
        );
      }
    }
    return stars;
  };

  const handleReviewTextChange = (event) => {
    setReviewText(event.target.value);
  };

  const handleReviewTitleChange = (event) => {
    setReviewTitle(event.target.value);
  };

  const handleReviewUserIDChange = (event) => {
    setReviewUserID(event.target.value);
  };

  const handleReviewRatingChange = (event) => {
    setReviewRating(event.target.value);
  };

  const handleReviewSubmit = (event) => {
    event.preventDefault();

    // Check if any of the fields is empty
    if (!reviewUserID || !reviewTitle || !reviewRating || !reviewText) {
      alert("Please fill out all fields");
      return;
    }

    setReviewVisible(false);
    document.querySelector(".card-container").classList.remove("expanded");
    // Send the review back to the parent component
    props.handleReview({
      bookId: props.book_id,
      reviewTitle: reviewTitle,
      reviewText: reviewText,
      rating: reviewRating,
      userId: reviewUserID,
    });
  };

  return (
    <div className={`card-container ${reviewVisible ? "expanded" : ""}`}>
      <img src={props.image} alt="" />
      <div className="desc">
        <h2>{props.title}</h2>
        <h6 style={grayTextStyle}>{props.author}</h6>
        <p style={grayTextStyle}>{props.published}</p>
        {renderStars()}
        <button onClick={() => setReviewVisible(!reviewVisible)}>
          {" "}
          {reviewVisible
            ? "Hide Review"
            : props.userID
            ? "Edit Review"
            : "Add a Review"}
        </button>
        {reviewVisible && (
          <form onSubmit={handleReviewSubmit}>
            <label>
              UserID:
              <br />
              <input
                type="text"
                value={reviewUserID}
                onChange={handleReviewUserIDChange}
              />
            </label>
            <br />
            <label>
              Review Title:
              <br />
              <input
                type="text"
                value={reviewTitle}
                onChange={handleReviewTitleChange}
              />
            </label>
            <br />
            <label>
              Rating:
              <br />
              <select value={reviewRating} onChange={handleReviewRatingChange}>
                <option value="0">0 stars</option>
                <option value="1">1 star</option>
                <option value="2">2 stars</option>
                <option value="3">3 stars</option>
                <option value="4">4 stars</option>
                <option value="5">5 stars</option>
              </select>
            </label>
            <br />
            <label>
              Review:
              <br />
              <textarea value={reviewText} onChange={handleReviewTextChange} />
            </label>
            <br />
            <button type="submit">
              {props.userID ? "Update Review" : "Submit"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookCard;
