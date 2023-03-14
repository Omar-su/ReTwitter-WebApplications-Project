

import { getDatabaseModels } from './db/connect_database';
import { connUrlTest } from './db/conn_url_origin';
const session = require('supertest-session');
import { app } from './start';

const sess = session(app);
let databaseModels = getDatabaseModels(connUrlTest);
jest.setTimeout(20000); // set timeout to 10 seconds


beforeEach(async () => {
    await sess
    .post('/user')
    .send({ userid: 'userid', ownerName : 'ownername',bio: 'bio', email : 'email', password: 'password' })

  // Perform a login request with the session
  await sess
    .post('/user/login')
    .send( {email: 'email',password: 'password'})
    .expect(200);

});



test('should create a user if not already created', async () => { 

    const useridWrongType = 1;
    const ownerNameWrongType = 1;
    const bioWrongType = 122;
    const emailWrongType = 123; 
    const passwordWrongType = 3124;

    // Create user with bad body types
    await sess
    .post('/user')
    .send({ userid: useridWrongType, ownerName : ownerNameWrongType ,bio: bioWrongType, email : emailWrongType, password: passwordWrongType }).expect(400);

    // Try to create user
    await sess
    .post('/user')
    .send({ userid: 'user', ownerName : 'owner',bio: 'my bio', email : 'email.gmail.com', password: 'password123' });

    // Try to create the same user
    await sess
    .post('/user')
    .send({ userid: 'user', ownerName : 'owner',bio: 'my bio', email : 'email.gmail.com', password: 'password123' }).expect(409);

});

test('User logout', async () => {
    // Log out 
    await sess
    .post('/user/logout')
    .send().expect(200);

});

test("User tweeting end-to-end tests", async () => {
    
    const description = "Test description";
    const res1 = await sess
    .post('/tweet')
    .send({description : description}).expect(201);
    expect(res1.body.description).toEqual(description);

    // Should recieve a 400 status error if description has other type than string
    const descriptionBadType = 123;
    await sess
    .post('/tweet')
    .send({description : descriptionBadType}).expect(400);

    // Log out
    await sess
    .post('/user/logout')
    .send().expect(200);

    await sess
    .post('/tweet')
    .send({description : description}).expect(401);

});

test("User liking a tweet end-to-end", async () => {
    
    const description = "Test description";
    const res = await sess
    .post('/tweet')
    .send({description : description});

    // Like a tweet
    await sess.post(`/tweet/${res.body.id}`)
    .send().expect(200);

    const negativeIdNr = "-1234";

    // Should not work with negative id numbers
    await sess.post(`/tweet/${negativeIdNr}`)
    .send().expect(400);

    // Id of tweet not created 
    const fakeIdNr = "12345";
    // Should not find the tweet
    await sess.post(`/tweet/${fakeIdNr}`)
    .send().expect(404);

    // Log out
    await sess
    .post('/user/logout')
    .send().expect(200);

    await sess.post(`/tweet/${res.body.id}`)
    .send().expect(401);
    

});



test("User getting feed tweets end-to-end", async () => {
    
    const tweetDesc1 = "Test description 1";
    const tweetDesc2 = "Test description 2";
    const tweetDesc3 = "Test description 3";

    // Create first tweet
    const res = await sess
    .post('/tweet')
    .send({description : tweetDesc1}).expect(201);

    // Create second tweet
    const res2 = await sess
    .post('/tweet')
    .send({description : tweetDesc2}).expect(201);

    // Create third tweet
    const res3 = await sess
    .post('/tweet')
    .send({description : tweetDesc3}).expect(201);

    // Get tweets on the feed
    const feedTweets = await sess.get('/tweet/feed')
    .send().expect(200);
    
    const tweetIds = [res.body.id, res2.body.id, res3.body.id];

    // Check if all tweets created are in the feed
    const allIdsInFeed = tweetIds.every((id) => feedTweets.body.some((tweet: { id: any; }) => tweet.id === id));
    
    expect(allIdsInFeed).toBe(true);

    // Log out
    await sess
    .post('/user/logout')
    .send().expect(200);

    await sess.get(`/tweet/feed`)
    .send().expect(401);
    

});



test("User deleting a tweet end-to-end", async () => {
    
    const description = "Test description";
    const res1 = await sess
    .post('/tweet')
    .send({description : description});

    // Delete tweet
    await sess.delete(`/tweet/${res1.body.id}`)
    .send().expect(200);

    const negativeIdNr = "-1234";

    // Try with negative id number
    await sess.post(`/tweet/${negativeIdNr}`)
    .send().expect(400);

    // Id of tweet not created 
    const fakeIdNr = "12345";
    // Should not find the tweet
    await sess.post(`/tweet/${fakeIdNr}`)
    .send().expect(404);

    // Create a tweet 
    const res2 = await sess
    .post('/tweet')
    .send({description : description});

    // Log out
    await sess
    .post('/user/logout')
    .send().expect(200);

    // Try deleting a tweet while logged out
    await sess.delete(`/tweet/${res2.body.id}`)
    .send().expect(401);
    

});


test("User commenting  on a tweet end-to-end", async () => {
    
    const description = "Test description";
    const res1 = await sess
    .post('/tweet')
    .send({description : description}).expect(201);

    const descriptionReply = "Test description reply";
    await sess
    .post(`/reply/${res1.body.id}`)
    .send({description : descriptionReply}).expect(201);

    // Should recieve a 400 status error if description has other type than string
    const descriptionBadType = 123;
    await sess
    .post(`/reply/${res1.body.id}`)
    .send({description : descriptionBadType}).expect(400);

    const negativeIdNr = "-1234";

    await sess.post(`/reply/${negativeIdNr}`)
    .send({description : descriptionReply}).expect(400);

    // Id of tweet not created 
    const fakeIdNr = "12345";
    // Should not find the tweet
    await sess.post(`/reply/${fakeIdNr}`)
    .send({description : descriptionReply}).expect(404);

    // Log out
    await sess
    .post('/user/logout')
    .send().expect(200);

    await sess.post(`/reply/${res1.body.id}`)
    .send({description : descriptionReply}).expect(401);

});


test("User getting replies on a tweet end-to-end", async () => {

    // Create a tweet
    const description = "Test description";
    const res1 = await sess
    .post('/tweet')
    .send({description : description}).expect(201);

    // Comment on a tweet
    const descriptionReply1 = "Test description reply";
    await sess
    .post(`/reply/${res1.body.id}`)
    .send({description : descriptionReply1}).expect(201);

    // Comment on a tweet
    const descriptionReply2 = "Test description reply";
    await sess
    .post(`/reply/${res1.body.id}`)
    .send({description : descriptionReply2}).expect(201);

    // Comment on a tweet
    const descriptionReply3 = "Test description reply";
    await sess
    .post(`/reply/${res1.body.id}`)
    .send({description : descriptionReply3}).expect(201);

    // Get all replies on a tweet
    const repliesOnTestTweet = await sess
    .get(`/reply/feed/replies/${res1.body.id}`)
    .send().expect(200);

    const repliesDescs = [descriptionReply1 , descriptionReply2 , descriptionReply3];

    // Check if all replies created are on the tweet
    const allDescsInTweetThread = repliesDescs.every((desc) => repliesOnTestTweet.body.some((reply: any) => reply.description == desc));

    expect(allDescsInTweetThread).toBe(true);

});

// test("Should be able to follow/unfollow and visit his and other people profiles", async () => {
//     const userid1 = "userid1";
//     const ownerName1 = "ownerName1";
//     const bio1 = "bio1";
//     const email1 = "email1"; 
//     const password1 = "password1";

//     // const user1Res = await sess
//     // .post('/user')
//     // .send({ userid: userid1, ownerName : ownerName1 ,bio: bio1, email : email1, password: password1 }).expect(201);
 
//     // const userid2 = "userid2";
//     // const ownerName2 = "ownerName2";
//     // const bio2 = "bio2";
//     // const email2 = "email2"; 
//     // const password2 = "password2";

//     // const user2Res = await sess
//     // .post('/user')
//     // .send({ userid: userid2, ownerName : ownerName2 ,bio: bio2, email : email2, password: password2 }).expect(201);

//     const currentUser = await sess
//     .get('/user/current_user')
//     .send().expect(200);

//     // Find a user profile page by username
//     const foundUser = await sess
//     .get(`/profile/${currentUser.body.userNameID}`)
//     .send().expect(200);

//     // Compare bodies of objects
//     expect(currentUser.body).toEqual(foundUser.body);

//     // Find a user profile page by username
//     const foundUser2 = await sess
//     .get(`/profile/${userid1}`)
//     .send().expect(200);

//     console.log("current 2 : " + JSON.stringify(foundUser2.body.following));
    

//     // Let current user follow foundUser2 already in the database
//     await sess
//     .get(`/profile/${foundUser2.body.userNameID}/follow`)
//     .send().expect(200);

//     // Compare bodies of objects
//     expect(currentUser.body.following).toContain(foundUser2.body.userNameID);

//     // Let current user follow foundUser2 already in the database
//     await sess
//     .get(`/profile/${foundUser2.body.userNameID}/unfollow`)
//     .send().expect(200);

//     // Compare bodies of objects
//     expect(currentUser.body.following).not.toContain(foundUser2.body.userNameID);


// });

// Clear the test database between each test
afterEach(async () => {
    //Ensure that only the test database is cleared
    if (databaseModels.getReplyModel().db.name == "db_for_unit_tests") {
      await databaseModels.getReplyModel().deleteMany({});
    }
    if (databaseModels.getTweetModel().db.name == "db_for_unit_tests") {
      await databaseModels.getTweetModel().deleteMany();
    }
    if (databaseModels.getUserModel().db.name == "db_for_unit_tests") {
      await databaseModels.getUserModel().deleteMany({});
    }
  });