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

const getUserByEmail = (email) => {
  //console.log("type of email param:", typeof email)
  for (let user in users) {
    let userProfile = users[user];
    let userEmail = users[user].email;
    //console.log("userProfile:", userProfile);
    //console.log("type of userEmail", typeof userEmail);
    //console.log("compare", email === userEmail)
    if (email === userEmail) {
      console.log("hello exsisting user")
      return userProfile;
    }
    
  } 
  console.log("hello new user")
  return null;
};

console.log(getUserByEmail("b@b.com"))

//module.exports = { getUserByEmail }
