

import supertest from 'supertest';
import { getDatabaseModels } from './db/connect_database';
import { connUrlTest } from './db/conn_url_origin';
import { TweetInterface } from './model/interfaces/tweet.interface';
const session = require('supertest-session');
import { app } from './start';

const request = supertest(app);
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

})

test('User logout', async () => {
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

    const description = "Test description";
    const res1 = await sess
    .post('/tweet')
    .send({description : description}).expect(201);

    const descriptionReply1 = "Test description reply";
    await sess
    .post(`/reply/${res1.body.id}`)
    .send({description : descriptionReply1}).expect(201);

    const descriptionReply2 = "Test description reply";
    await sess
    .post(`/reply/${res1.body.id}`)
    .send({description : descriptionReply2}).expect(201);

    const descriptionReply3 = "Test description reply";
    await sess
    .post(`/reply/${res1.body.id}`)
    .send({description : descriptionReply3}).expect(201);

    const repliesOnTestTweet = await sess
    .get(`/reply/feed/replies/${res1.body.id}`)
    .send().expect(200);

    const repliesDescs = [descriptionReply1 , descriptionReply2 , descriptionReply3];

    const allDescsInTweetThread = repliesDescs.every((desc) => repliesOnTestTweet.body.some((reply: any) => reply.description == desc));

    expect(allDescsInTweetThread).toBe(true);

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