const { assert } = require('chai');

const { getUserByEmail } = require('../helper.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('when given a valid email, it should return the correct userID object', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = testUsers["userRandomID"];
    assert.equal(user, expectedUserID);
  });

  it('when given an invalid email, it should return null', function() {
    const user = getUserByEmail("user123@example.com", testUsers)
    assert.isNull(user);
  });

  it('when given a valid email, it should return an object', function() {
    const user = getUserByEmail("user@example.com", testUsers)    
    assert.isObject(user);
  });

  it('when given a valid email, it should return the correct userID', function() {
    const user = getUserByEmail("user@example.com", testUsers).id
    const expectedUserID = "userRandomID";
  
    assert.equal(user, expectedUserID);
  });
});

