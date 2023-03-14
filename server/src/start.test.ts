// import * as SuperTest from "supertest";
// import { TweetInterface } from "./model/interfaces/tweet.interface";
// import { app } from "./start";

// const request = SuperTest.default(app);

// test("End-to-end test", async () => {
//     const description = "Test description";
//     const author = "author test";
//     const res1 = await request.post("/tweet").send({author: author, description : description});
//     expect(res1.statusCode).toEqual(201);
//     expect(res1.body.description).toEqual(description);
//     const res2 = await request.get("/tweet");
//     expect(res2.statusCode).toEqual(200);
//     expect(res2.body.map((tweet : TweetInterface) => tweet.description)).toContain(description);
// });

// test("Follow test", async () => {
//     const userID1 = "account1";
//     const ownerName1 = "owner1";
//     const bio1 = "bio1"

//     const userID2 = "account2";
//     const ownerName2 = "owner2";
//     const bio2 = "bio2"

//     const createRes1 = await request.post("/newuser").send({userID: userID1, ownerName : ownerName1,
//     bio : bio1});
//     expect(createRes1.statusCode).toEqual(201);

//     const createRes2 = await request.post("/newuser").send({userID: userID2, ownerName : ownerName2,
//         bio : bio2});
//         expect(createRes2.statusCode).toEqual(201);


//     const followRes = await request.post("/profile/account1/follow").send({followee: userID1,
//         follower: userID2});
//         expect(followRes.statusCode).toEqual(200);

//     const profilesRes = await request.get("/profiles");
//     expect(profilesRes.statusCode).toEqual(200);
    
//     const followedAccount = profilesRes.body.find((profile: { userNameID: string; }) => 
//     {return profile.userNameID === userID1});
//     expect(followedAccount.getFollowers === 1);

//     const followingAccount = profilesRes.body.find((profile: { userNameID: string; }) => 
//     {return profile.userNameID === userID2});
//     expect(followingAccount.following === 1);


// });

import supertest from 'supertest';
import { getDatabaseModels } from './db/connect_database';
import { connUrlTest } from './db/conn_url_origin';
import { TweetInterface } from './model/interfaces/tweet.interface';
const session = require('supertest-session');
import { app } from './start';

const request = supertest(app);
const sess = session(app);
let databaseModels = getDatabaseModels(connUrlTest);

beforeEach(async () => {
    await sess
    .post('/user')
    .send({ userid: 'userid', ownerName : 'ownername',bio: 'bio', email : 'email', password: 'password' })

  // Perform a login request with the session
  await sess
    .post('/user/login')
    .send( {email: 'email',password: 'password'})
    .expect(200);

})

test('User logout', async () => {
    await sess
    .post('/user/logout')
    .send().expect(200);

});

test("User tweeting error handling", async () => {
    
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

    await sess.post(`/tweet/${res.body.id}`)
    .send().expect(200);

    const negativeIdNr = "-1234";

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

    const res = await sess
    .post('/tweet')
    .send({description : tweetDesc1}).expect(201);

    const res2 = await sess
    .post('/tweet')
    .send({description : tweetDesc2}).expect(201);

    const res3 = await sess
    .post('/tweet')
    .send({description : tweetDesc3}).expect(201);

    const feedTweets = await sess.get('/tweet/feed')
    .send().expect(200);
    
    const tweetIds = [res.body.id, res2.body.id, res3.body.id];

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

    await sess.delete(`/tweet/${res1.body.id}`)
    .send().expect(200);

    const negativeIdNr = "-1234";

    await sess.post(`/tweet/${negativeIdNr}`)
    .send().expect(400);

    // Id of tweet not created 
    const fakeIdNr = "12345";
    // Should not find the tweet
    await sess.post(`/tweet/${fakeIdNr}`)
    .send().expect(404);

    
    const res2 = await sess
    .post('/tweet')
    .send({description : description});

    // Log out
    await sess
    .post('/user/logout')
    .send().expect(200);

    await sess.delete(`/tweet/${res2.body.id}`)
    .send().expect(401);
    

});

afterEach(async () => {
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