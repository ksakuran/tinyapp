

// const urlDatabase = {
//   "b2xVn2": {
//     longURL: "http://www.lighthouselabs.ca",
//     userID: "aJ48lW",
//   },
//   "9sm5xK": {
//     longURL: "https://www.google.ca",
//     userID: "aJ48lW",
//   },
//   "9sm5x8": {
//     longURL: "https://http.cat/",
//     userID: "diff",
//   },
// };


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

module.exports = { getUserByEmail };