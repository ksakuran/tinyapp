const generateRandomString = () => {
  let randomString = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < 6; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomString;
};

const urlsForUserByUserID = (userTag) => {
  //console.log("userTag", userTag);
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
      //console.log("hello exsisting user")
      return userProfile;
    }
    
  } 
  //console.log("hello new user")
  return null;
};


const { response } = require("express");
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
app.use(cookieSession ({
  name: "session",
  keys: ["asfkjn329:4rtBDF34058dfgKB", "Dab37sfVHDA993/fd4589"]
}));

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

app.post("/urls", (req, res) => {

  if (!req.session.userID) {
    // testing to see if database is changed when using curl 
    //console.log(urlDatabase);
    return res.status(401).send("Must be logged in to shorten a URL")
  }
  console.log("req.body", req.body)
  const id = generateRandomString();
  urlDatabase[id] = { 
    userID: req.session.userID,
    longURL: req.body.longURL
  }

  console.log("urlDatabase:", urlDatabase);
  
  res.redirect(`/urls/${id}`);
});

app.post("/register", (req, res) => {
  const id = generateRandomString();
  const userEmail = req.body.email;
  const password = req.body.password;

  const hashedPassword = bcrypt.hashSync(password, 10);
  
  if (!password || !userEmail) {
    return res.status(400).send("Please enter an email and a password");
  }

  if(getUserByEmail(userEmail, users)) {
    return res.status(400).send("Email address is already registered");
  }
  //console.log("hello")
  users[id] = {
    id: id,
    email: userEmail,
    password: hashedPassword
  };
  //console.log("users after register:", users)
  return res.redirect("/login");
});



app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

app.post("/urls/:id/update", (req, res) => {
  
  if (!req.session.userID) {
    res.status(401).send("Only logged in user's can edit shortened URL details")
  }

  const id = req.params.id;
  //console.log("id", id);
  //console.log(req.body.longurl)
  urlDatabase[id].longURL = req.body.longurl
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  //console.log("req.body", req.body);
  const email = req.body.email;
  const password = req.body.password;
  
  //console.log("getuserbyemail",getUserByEmail(email));
  
  if (!getUserByEmail(email, users)) {
    return res.status(403).send("User credentials not found");
  }
  
  userData = getUserByEmail(email, users);
  const hashedPassword = userData.password
  
  if (!bcrypt.compareSync(password, hashedPassword)) {
    return res.status(403).send("User credentials incorrect");
  }

  console.log("userData.id", userData.id);
  req.session.userID = userData.id;
  req.session.email = email;
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {

  const id = req.params.id;

  if (!urlDatabase[id]) {
    return res.status(404).send("No URL found, cannot delete");
  }

  if (!req.session.userID) {
    return res.status(401).send("Only logged in users can delete a shortened URL details")
  }

  if (req.session.userID !== urlDatabase[id].userID) {
    return res.status(404).send("URL is not owned by user, cannot delete");
  }

  delete urlDatabase[id];
  //console.log("urlDatabase.id after delete", urlDatabase[id])
  res.redirect("/urls");
  
});

app.get("/u/:id", (req, res) => {
  //console.log("req.params", req.params);
  //console.log("req.params.id", req.params.id);  
  if(!urlDatabase[req.params.id]) {
    return res.status(404).send("Shortened URL is not in database"); 
  }

  let longURL = urlDatabase[req.params.id].longURL;
  //console.log(longURL)
  return res.redirect(`${longURL}`);

});



app.get("/login", (req, res) => {
  
  if (req.session.userID) {
    return res.redirect("/urls");
  }
  
  const templateVars = {
    userID: req.session["userID"]
    // email: req.cookies["email"]
  };

  res.render("login", templateVars);
});

app.get("/urls/new", (req, res) => {

  if(!req.session.userID) {
    return res.redirect("/login");
  }

  const templateVars = {
    userID: req.session["userID"],
    email: req.session["email"]
  };

  res.render("urls_new", templateVars);
});


app.get("/urls/:id", (req, res) => {
  if(!req.session.userID) {
    return res.status(403).send("User must be logged in to view or edit a URL");
  }

  if (urlDatabase[req.params.id].userID !== req.session.userID) {
    return res.status(401).send("Short URL detail page is only accessible for Short URL's created by your account");
  }

  

  const templateVars = { 
    id: req.params.id, 
    longURL: urlDatabase[req.params.id].longURL,
    userID: req.session["userID"],
    email: req.session["email"]
  };
  res.render("urls_show", templateVars);
});  


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get('/urls', (req, res) => {
  
  if (!req.session.userID) {
    return res.status(403).send("Must be logged in to view your URLs")
  }

  const usersURLs = urlsForUserByUserID(req.session.userID);
  
  //console.log("users:", users);
  //console.log("req.session.userID", req.session.userID)

  const templateVars = { 
    urls: usersURLs,
    userID: req.session["userID"],
    email: req.session["email"]

  };
  res.render("urls_index", templateVars);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
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
})



app.get("/", (req, res) => {
  res.send("Hello!");
});


app.listen(PORT, () => {
  console.log(`Example app listening on ${PORT}!`);
});
