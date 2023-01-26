const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "aJ48lW",
  },
  "9sm5xK": {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
  "9sm5x8": {
    longURL: "https://http.cat/",
    userID: "diff",
  },
};

const urlsForUserByID = (userTag) => {
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

console.log(urlsForUserByID("aJ48lW"));