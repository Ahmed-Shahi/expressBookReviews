const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop using Promises (Task 10)
public_users.get('/', function (req, res) {
  const get_books = new Promise((resolve, reject) => {
    resolve(books);
  });
  get_books.then((bks) => {
    res.send(JSON.stringify(bks, null, 4));
  }).catch((err) => {
    res.status(500).send(err);
  });
});

// Get book details based on ISBN using Promises (Task 11)
public_users.get('/isbn/:isbn', function (req, res) {
  const get_isbn = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  });
  get_isbn.then((bk) => {
    res.send(JSON.stringify(bk, null, 4));
  }).catch((err) => {
    res.status(404).send(err);
  });
});
  
// Get book details based on author using Promises (Task 12)
public_users.get('/author/:author', function (req, res) {
  const get_author = new Promise((resolve, reject) => {
    const author = req.params.author;
    const keys = Object.keys(books);
    const matchingBooks = [];
    for (let key of keys) {
      if (books[key].author === author) {
        matchingBooks.push(books[key]);
      }
    }
    resolve(matchingBooks);
  });
  get_author.then((bks) => {
    res.send(JSON.stringify(bks, null, 4));
  }).catch((err) => {
    res.status(500).send(err);
  });
});

// Get all books based on title using Promises (Task 13)
public_users.get('/title/:title', function (req, res) {
  const get_title = new Promise((resolve, reject) => {
    const title = req.params.title;
    const keys = Object.keys(books);
    const matchingBooks = [];
    for (let key of keys) {
      if (books[key].title === title) {
        matchingBooks.push(books[key]);
      }
    }
    resolve(matchingBooks);
  });
  get_title.then((bks) => {
    res.send(JSON.stringify(bks, null, 4));
  }).catch((err) => {
    res.status(500).send(err);
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
