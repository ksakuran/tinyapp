const express = require("express");
const app = express();
const morgan = require("morgan");
const PORT = 8080; //default port on 8080;

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// "/" root path
app.length("/", (request, response) => {
  response.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on ${PORT}!`);
});



