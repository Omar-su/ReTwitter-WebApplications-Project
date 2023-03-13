import { before } from "node:test";
import { getDatabaseModels } from "../db/connect_database";
import { connUrlTest } from "../db/conn_url_origin";
import { makeTweetDBService } from "./db/TweetDBService";
import { makeUserDBService } from "./db/UserDBService";
import { TweetServiceInterface } from "./interfaces/tweetservice.interface";
import { UserServiceInterface } from "./interfaces/userservice.interface";

const testUserName = "testuser";
let userService!: UserServiceInterface;
let tweetService!: TweetServiceInterface;
let databaseModels = getDatabaseModels(connUrlTest);

beforeEach(async () => {
  userService = makeUserDBService(databaseModels);
  tweetService = makeTweetDBService(databaseModels);
  await userService.createUser(testUserName, "testownername", "testbio", "test@test.com", "testpassword");
});

test("If a tweet is created then it should be in the list of tweets", async () => {
  const desc = "testDescription1";
  await tweetService.createTweet(testUserName, desc);
  const tweets = await tweetService.getTweets();
  expect(tweets.some((tweet) => tweet.description === desc)).toBeTruthy();
});

test("If a tweet is deleted then it should not be in the list of tweets", async () => {
  const desc = "testDescription2";
  await tweetService.createTweet(testUserName, desc);
  const tweetsBeforeDelete = await tweetService.getTweets();
  const createdTweet = tweetsBeforeDelete.find((tweet) => tweet.description === desc); // get tweet from list of tweets
  const tweetAuthor = await userService.findUserByUsername(testUserName);
  if (createdTweet && tweetAuthor) { // if successfully created
    await tweetService.deleteTweet(tweetAuthor, createdTweet.id);
    const tweetsAfterDelete = await tweetService.getTweets();
    expect(tweetsAfterDelete.some((tweet) => tweet.description === desc)).toBeFalsy();
  };
});

test("If a tweet is liked, the number of likes should increase", async () => {
  const desc = "testDescription3";
  const testTweet = await tweetService.createTweet(testUserName, desc);
  const tweetAuthor = await userService.findUserByUsername(testUserName);
  if (testTweet && tweetAuthor) { //Ensures that testTweet is not undefined
    const likrNrBeforeLike = testTweet.numberOfLikes;
    tweetService.likeOrUnlikeTweet(tweetAuthor, testTweet.id);
    expect(testTweet.numberOfLikes === likrNrBeforeLike + 1);
  }
});


test("If a tweet is unliked, the number of likes should descrease", async () => {
  const desc = "testDescription4";
  const testTweet = await tweetService.createTweet(testUserName, desc);
  const tweetAuthor = await userService.findUserByUsername(testUserName);
  if (testTweet && tweetAuthor) { //Ensures that testTweet is not undefined
    tweetService.likeOrUnlikeTweet(tweetAuthor, testTweet.id); // Like the tweet first
    const likrNrBeforeUnLike = testTweet.numberOfLikes;
    tweetService.likeOrUnlikeTweet(tweetAuthor, testTweet.id);
    expect(testTweet.numberOfLikes === likrNrBeforeUnLike - 1);
  }
});

test("If a tweet is replied to, its number of replies should increase", async () => {
  const desc = "testDescription5";
  const testTweet = await tweetService.createTweet(testUserName, desc);
  const tweetAuthor = await userService.findUserByUsername(testUserName);
  if(testTweet && tweetAuthor) {
    const replyNrBeforeReply = testTweet.numberOfReplies;
    tweetService.replyOnTweetOrReply(tweetAuthor, testTweet.id, desc)
    expect(testTweet.numberOfReplies === replyNrBeforeReply + 1);
  }
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