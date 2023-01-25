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
const cookieParser = require('cookie-parser');
const PORT = 8080; //default port on 8080;

app.set("view engine", "ejs");

//middleware, parses body data
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "1@1.com",
    password: "purple",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "2@2.com",
    password: "funk",
  },
};

app.post("/register", (req, res) => {
  //console.log("req.body", req.body);
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  users[id] = {
    id: id,
    email: email,
    password: password};
    res.cookie("userID", users[id])
  console.log("users:", users);
  res.redirect("/urls")
});



app.post("/logout", (req, res) => {
  res.clearCookie("userID");
  res.redirect("/urls")
});

app.post("/urls/:id/update", (req, res) => {
  const id = req.params.id
  //console.log("id", id);
  //console.log(req.body.longurl)
  urlDatabase[id] = req.body.longurl
  res.redirect("/urls")
});

app.post("/urls/:id/delete", (req, res) => {
  //console.log("req.params", req.params);
  const id = req.params.id;
  //console.log("urlDatabase.id", urlDatabase[id])
  delete urlDatabase[id];
  //console.log("urlDatabase.id after delete", urlDatabase[id])
  res.redirect("/urls")
  
});

app.get("/u/:id", (req, res) => {
  //console.log(req.params.id);
  const longURL = urlDatabase[req.params.id];
  //console.log(longURL)
  res.redirect(`${longURL}`);
});

app.post("/login", (req, res) => {
  //console.log("req.body", req.body);
  const email = req.body.email;
  //console.log("username: ", username);
  res.cookie("email", email);
  res.redirect("/urls");
});


app.get("/urls/new", (req, res) => {
  const templateVars = {
    userID: req.cookies["userID"],
  };
  res.render("urls_new", templateVars);
});


app.get("/urls/:id", (req, res) => {
  const templateVars = { 
    id: req.params.id, 
    longURL: urlDatabase[req.params.id],
    userID: req.cookies["userID"]
  };
  res.render("urls_show", templateVars);
});  


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get('/urls', (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    userID: req.cookies["userID"]
  };
  res.render("urls_index", templateVars);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/register", (req, res) => {
  const templateVars = {
    userID: req.cookies["userID"]
  };
  res.render("register", templateVars)
})


app.post("/urls", (req, res) => {
  const id = generateRandomString();
  urlDatabase[id] = req.body.longURL;
  //console.log(req.body.longURL);
  //console.log(urlDatabase);
  
  res.redirect(`/urls/${id}`);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});


app.listen(PORT, () => {
  console.log(`Example app listening on ${PORT}!`);
});



