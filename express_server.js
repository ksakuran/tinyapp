const generateRandomString = () => {
  let randomString = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < 6; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomString;
};


const { response } = require("express");
const express = require("express");
const app = express();
const morgan = require("morgan");
const PORT = 8080; //default port on 8080;

app.set("view engine", "ejs");

//middleware, parses body data
app.use(express.urlencoded({ extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};  

app.post("/urls/:id/delete", (req, res) => {
  //console.log("req.params", req.params);
  const id = req.params.id;
  //console.log("urlDatabase.id", urlDatabase[id])
  delete urlDatabase[id];
  //console.log("urlDatabase.id after delete", urlDatabase[id])
  res.redirect("/urls")

});

app.get("/u/:id", (req, res) => {
  console.log(req.params.id);
  const longURL = urlDatabase[req.params.id];
  console.log(longURL)
  res.redirect(`${longURL}`);
});


app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});


app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id]};
  res.render("urls_show", templateVars);
});  


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.post("/urls", (req, res) => {
  const id = generateRandomString();
  urlDatabase[id] = req.body.longURL;
  console.log(req.body.longURL);
  //console.log(urlDatabase);
  
  res.redirect(`/urls/${id}`);
});



app.listen(PORT, () => {
  console.log(`Example app listening on ${PORT}!`);
});



