import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookBookmark } from "@fortawesome/free-solid-svg-icons";
const Header = () => {
  return (
    <header>
      <FontAwesomeIcon icon={faBookBookmark} size="2x" />
      <h1>Book Buddy Application</h1>
    </header>
  );
};
export default Header;
