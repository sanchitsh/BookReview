import React from "react";

const LookUpArea = (props) => {
  return (
    <div className="lookup-area">
      <form onSubmit={props.askForBooks} action="">
        <label htmlFor="searchBox">Search for a book</label>
        <input
          onChange={props.handleQuery}
          type="text"
          id="searchBox"
          placeholder="Enter book title or author"
        />
        <button type="submit">Search</button>
        <label htmlFor="searchBox">Or</label>
      </form>
      <form onSubmit={props.askuserID} action="">
        <label htmlFor="searchBox">Your Books </label>
        <input
          onChange={props.handleIDQuery}
          type="text"
          id="searchBox"
          placeholder="Enter User ID"
        />
        <button type="submit">Get</button>
      </form>
    </div>
  );
};

export default LookUpArea;
