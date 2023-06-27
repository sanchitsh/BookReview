import React from "react";

const StarRating = ({ rating }) => {
  const filledStars = Math.floor(rating);
  const hasHalfStar = rating - filledStars >= 0.5;

  const stars = [];
  for (let i = 0; i < filledStars; i++) {
    stars.push(<i key={i} className="fa fa-star"></i>);
  }
  if (hasHalfStar) {
    stars.push(<i key={filledStars} className="fa fa-star-half-o"></i>);
  }

  return <div>{stars}</div>;
};

export default StarRating;
