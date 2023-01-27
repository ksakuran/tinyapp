

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