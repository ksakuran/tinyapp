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
  for (let user in users) {
    let userProfile = users[user]
    let userEmail = users[user].email
    if (email !== userEmail) {
      return null;
    }
    return userProfile;
  }
};


console.log(getUserByEmail("b@b.com"))

//module.exports = { getUserByEmail }
