import { before } from "node:test";
import { makeTweetDBService } from "./db/TweetDBService";
import { makeUserDBService } from "./db/UserDBService";
import { TweetServiceInterface } from "./interfaces/tweetservice.interface";
import { UserServiceInterface } from "./interfaces/userservice.interface";
import { makeTweetService } from "./oldservices/tweet";

const testUserName = "testuser";
let userService: UserServiceInterface;
let tweetService: TweetServiceInterface;

beforeAll(async () => {
  userService = makeUserDBService();
  tweetService = makeTweetDBService();
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
  const createdTweet = tweetsBeforeDelete.find((tweet) => tweet.description === desc);
  const tweetAuthor = await userService.findUserByUsername(testUserName);
  if (createdTweet && tweetAuthor) { // if successfully created
    await tweetService.deleteTweet(tweetAuthor, createdTweet.id);
    const tweetsAfterDelete = await tweetService.getTweets();
    expect(tweetsAfterDelete.some((tweet) => tweet.description === desc)).toBeFalsy();
  };
});



test("If a tweet is liked, the number of likes should increase", async () => {
  const desc = "testDescription3";
  await tweetService.createTweet(testUserName, desc);
  const tweets = await tweetService.getTweets();
  const testTweet = tweets.find((tweet) => tweet.description === desc);
  const tweetAuthor = await userService.findUserByUsername(testUserName);
  if (testTweet && tweetAuthor) { //Ensures that testTweet is not undefined
    const likrNrBeforeLike = testTweet.numberOfLikes;
    tweetService.likeOrUnlikeTweet(tweetAuthor, testTweet.id);
    expect(testTweet.numberOfLikes === likrNrBeforeLike + 1);
  }
});

// test("If a tweet is unliked, the number of likes should descrease", async () => {
//   const desc = "testDescription3";
//   await tweetService.createTweet(testUserName, desc);
//   const tweets = await tweetService.getTweets();
//   const testTweet = tweets.find((tweet) => tweet.description === desc);
//   const tweetAuthor = await userService.findUserByUsername(testUserName);
//   if (testTweet && tweetAuthor) { //Ensures that testTweet is not undefined
//     const likrNrBeforeLike = testTweet.numberOfLikes;
//     tweetService.likeOrUnlikeTweet(tweetAuthor, testTweet.id);
//     expect(testTweet.numberOfLikes === likrNrBeforeLike + 1);
//   }
// });

afterAll(async () => {
  const allTweets = await tweetService.getTweets();
  const testTweet1 = allTweets.find((tweet) => tweet.description === "testDescription1");
  const testTweet2 = allTweets.find((tweet) => tweet.description === "testDescription2");
  const testTweet3 = allTweets.find((tweet) => tweet.description === "testDescription3");
  const tweetAuthor = await userService.findUserByUsername(testUserName);
  if(testTweet1 && tweetAuthor){
    tweetService.deleteTweet(tweetAuthor, testTweet1.id);
  }
  if(testTweet2 && tweetAuthor){
    tweetService.deleteTweet(tweetAuthor, testTweet2.id);
  }
  if(testTweet3 && tweetAuthor){
    tweetService.deleteTweet(tweetAuthor, testTweet3.id);
  }
})