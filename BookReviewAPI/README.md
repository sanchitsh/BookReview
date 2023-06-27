# Books App Backend
A web application that stores book reviews from users

The front-end is created using Express framework to handle the API's incoming and outgoing HTTP requests. The book data is gathered from a public source called Google Books. THe database is hosted locally on sqlite, Helmet is used to secure the API Gateway from certain attacks like Cross-Site Scripting, Morgan for logging HTTP requests/responses, cors to enable Cross-origin resource sharing for Express API

## Setup
First install all the required packages (libraries mentioned in the comments above or in package.json).
Also ensure that you have set the proper API credentials for the Google Books API to function as intended
To run the back end, make sure that you located in the api folder and run the following command `node index.js`

## Features 
-The backend allows user to query the Google Books API and lookup books based on book name, author name or any identifying information for a perticular book including ISBN.
-It also has a local relational database with a table that contains all user reviews for the books that a user has looked up
-The API allows users to look up all reviews by a username, all reviews for a book and or just the collection of all reviews.
-The API also allows the user to create and update reviews based on their username, and provides the most up to date reviews. All changes are permanetly stored in the sqlit db.

## Future Improvements 
The backend has some minor improvements that can be made to improve its security and reliability: 
-While I used Helmet to protect the API from certain 3rd party attacts, it can be easily used to inject sql code and cause security concerns. To fix this, there is a need to escape a comprehensive set of characters.
-There can be more tables to fascilitate the ability to allow users tot create private logins and not easily just lookup anyones reviews by their userID.
-The API uses Google Books to query certain data, but it has some usage limits(free tier). If there is a need to scale the application, we would definately look into changing the way we get the book data.

## Available Scripts
`node index.js` to run the back-end on port 3001. Port number can also be changed in index.js as per device requirements.