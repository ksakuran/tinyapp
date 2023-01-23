const express = require("express");
const app = express();
const morgan = require("morgan");
const PORT = 8080; //default port on 8080;

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/urls.json", (request, response) => {
  response.json(urlDatabase);
});

// "/" root path
app.get("/", (request, response) => {
  response.send("Hello!");
});


app.listen(PORT, () => {
  console.log(`Example app listening on ${PORT}!`);
});



