// const generateRandomString = () => {
//   let randomString = "";
//   const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
//   for (let i = 0; i < 6; i++) {
//     randomString += characters.charAt(Math.floor(Math.random() * characters.length));
//   }
//   return randomString;
// };

// const urlsForUserByUserID = (userTag) => {
//   //console.log("userTag", userTag);
//   let usersURLs = {};

//   for (let shortUrlID in urlDatabase) {
//     let shortUrlInfo = urlDatabase[shortUrlID];    
//     if (userTag === shortUrlInfo.userID) {
//       usersURLs[shortUrlID] = {
//         longURL: shortUrlInfo.longURL
//       };
//     }
//   }
//   return usersURLs;
// };

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

