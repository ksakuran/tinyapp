//left these helper functions at the top, because compass instructions say not to worry about exporting modules
const generateRandomString = () => {
  let randomString = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < 6; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomString;
};

const urlsForUserByUserID = (userTag) => {

  let usersURLs = {};

  for (let shortUrlID in urlDatabase) {
    let shortUrlInfo = urlDatabase[shortUrlID];
    if (userTag === shortUrlInfo.userID) {
      usersURLs[shortUrlID] = {
        longURL: shortUrlInfo.longURL
      };
    }
  }
  return usersURLs;
};

const getUserByEmail = (email, database) => {
  
  for (let user in database) {
    let userProfile = database[user];
    let userEmail = database[user].email;

    if (email === userEmail) {

      return userProfile;
    }
    
  }
  
  return null;
};

const express = require("express");
const app = express();
const morgan = require("morgan");
const bcrypt = require("bcryptjs");
const cookieSession = require("cookie-session");
const PORT = 8080;

app.set("view engine", "ejs");

//middleware
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true}));
app.use(cookieSession({
  name: "session",
  keys: ["asfkjn329:4rtBDF34058dfgKB", "Dab37sfVHDA993/fd4589"]
}));

//sample database for testing, this date base will be manipulated when users create new urls
const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "aJ48lW",
  },
  "9sm5xK": {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
  "8sp5L7": {
    longURL: "https://http.cat",
    userID: "userRandomID",
  }
};

// user database for testing, is updated when users register, and is checked against when users login
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "1@1.com",
    password: "purple",
  },
  user2RandomID: {
    id: "aJ48lW",
    email: "2@2.com",
    password: "funk",
  },
};


//redirects any user (logged in or not) to the actual link that is stored at the short url ID
app.get("/u/:id", (req, res) => {
  const shortUrlID = req.params.id;
  
  if (!urlDatabase[shortUrlID]) {
    return res.status(404).send("Shortened URL is not in database");
  }
  
  let longURL = urlDatabase[shortUrlID].longURL;
  
  return res.redirect(`${longURL}`);
  
});

app.get("/login", (req, res) => {
  
  if (req.session.userID) {
    return res.redirect("/urls");
  }
  
  const templateVars = {
    userID: req.session["userID"]
  };
  
  res.render("login", templateVars);
});

app.get("/urls/new", (req, res) => {

  if (!req.session.userID) {
    return res.redirect("/login");
  }

  const templateVars = {
    userID: req.session["userID"],
    email: req.session["email"]
  };
  
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  
  const shortUrlID = req.params.id;
  
  if (!req.session.userID) {
    return res.status(403).send("User must be logged in to view or edit a URL");
  }
  
  if (!urlDatabase[shortUrlID]) {
    return res.status(404).send("Short URL not found")
  }
  
  if (urlDatabase[shortUrlID].userID !== req.session.userID) {
    return res.status(401).send("Short URL detail page is only accessible for Short URL's created by your account");
  }
  
  
  const templateVars = {
    id: shortUrlID,
    longURL: urlDatabase[shortUrlID].longURL,
    userID: req.session["userID"],
    email: req.session["email"]
  };
  res.render("urls_show", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  
  if (!req.session.userID) {
    return res.status(403).send("Must be logged in to view your URLs");
  }
  
  //loops through on the index page to only show urls associated with the user
  const usersURLs = urlsForUserByUserID(req.session.userID);
  
  const templateVars = {
    urls: usersURLs,
    userID: req.session["userID"],
    email: req.session["email"]
  };
  
  res.render("urls_index", templateVars);
});

app.get("/register", (req, res) => {
  if (req.session.userID) {
    return res.redirect("/urls");
  }
  const templateVars = {
    userID: req.session["userID"],
    email: req.session["email"]
  };
  res.render("register", templateVars);
});

app.get("/", (req, res) => {
  if (req.session.userID) {
    res.redirect("/urls");
  }
  res.redirect("/login")
});


app.post("/urls", (req, res) => {

  if (!req.session.userID) {
    return res.status(401).send("Must be logged in to shorten a URL");
  }
  
  const shortUrlID = generateRandomString();
  
  //add new short url id key to url database
  urlDatabase[shortUrlID] = {
    longURL: req.body.longURL,
    userID: req.session.userID
  };

  res.redirect(`/urls/${shortUrlID}`);
});

//adding new user to users object database
app.post("/register", (req, res) => {
  const userTag = generateRandomString();
  const userEmail = req.body.email;
  const password = req.body.password;

  const hashedPassword = bcrypt.hashSync(password, 10);
  
  if (!password || !userEmail) {
    return res.status(400).send("Please enter an email and a password");
  }

  if (getUserByEmail(userEmail, users)) {
    return res.status(400).send("Email address was previously registered");
  }
  
  users[userTag] = {
    id: userTag,
    email: userEmail,
    password: hashedPassword
  };

  console.log("users after registration", users)

  req.session.email = userEmail;
  req.session.userID = users[userTag].id;
  return res.redirect("/urls");
});

//clearing cookies and redirecting to login page
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

// added the /update to make it clearer what is happening at this route
app.post("/urls/:id/update", (req, res) => {
  const shortUrlID = req.params.id;
  
  if (!req.session.userID) {
    res.status(401).send("Only logged in user's can edit shortened URL details");
  }

  if (req.session.userID !== urlDatabase[shortUrlID].userID) {
    return res.status(404).send("URL is not owned by user, cannot edit");
  }
  //reassigns the longurl associated with the short url id
  urlDatabase[shortUrlID].longURL = req.body.longurl;

  res.redirect("/urls");
});


app.post("/login", (req, res) => {

  const emailFromForm = req.body.email;
  const passwordFromForm = req.body.password;
  
  //check that account is registered
  if (!getUserByEmail(emailFromForm, users)) {
    return res.status(403).send("User credentials not found");
  }
  
  const userData = getUserByEmail(emailFromForm, users);
  const hashedPassword = userData.password;
  
  //check if passwords match
  if (!bcrypt.compareSync(passwordFromForm, hashedPassword)) {
    return res.status(403).send("User credentials incorrect");
  }

  req.session.userID = userData.id;
  req.session.email = emailFromForm;
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {

  const shortUrlID = req.params.id;

  if (!urlDatabase[shortUrlID]) {
    return res.status(404).send("No URL found, cannot delete");
  }

  if (!req.session.userID) {
    return res.status(401).send("Only logged in users can delete a shortened URL details");
  }

  if (req.session.userID !== urlDatabase[shortUrlID].userID) {
    return res.status(404).send("URL is not owned by user, cannot delete");
  }
  
  delete urlDatabase[shortUrlID];

  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on ${PORT}!`);
});
