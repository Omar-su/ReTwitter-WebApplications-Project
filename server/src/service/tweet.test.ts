import { before } from "node:test";
import { makeTweetDBService } from "./db/TweetDBService";
import { makeUserDBService } from "./db/UserDBService";
import { makeTweetService } from "./oldservices/tweet";

const testUserName = "testuser";
const userService = makeUserDBService();

beforeAll(() => {
  userService.createUser(testUserName, "testownername", "testbio", "test@test.com", "testpassword");
});


test("If a tweet is created then it should be in the list of tweets", async () => {

  const desc = "description for the sake of testing";
  const tweetService = makeTweetDBService();
  await tweetService.createTweet(testUserName, desc);
  const tweets = await tweetService.getTweets();
  expect(tweets.some((tweet) => tweet.description === desc)).toBeTruthy();
})

test("If a tweet is deleted then it should not be in the list of tweets", async () => {

  const desc = "This tweet should be removed";
  const tweetService = makeTweetDBService();
  await tweetService.createTweet(testUserName, desc);
  const tweetsBeforeDelete = await tweetService.getTweets();
  const createdTweet = tweetsBeforeDelete.find((tweet) => tweet.description === desc);
  const tweetAuthor = await userService.findUserByUsername(testUserName);
  if(createdTweet && tweetAuthor){ // if successfully created
      await tweetService.deleteTweet(tweetAuthor, createdTweet.id);
      const tweetsAfterDelete = await tweetService.getTweets();
      expect(tweetsAfterDelete.some((tweet) => tweet.description === desc)).toBeFalsy();
  };
});



// test("If a tweet with 5 likes is liked, the number of likes is 6",async () => {
//   const desc = "Like this tweet";
//   const author = "testuser";
//   const tweetService = makeTweetDBService();
//   await tweetService.createTweet(author, desc);
//   const tweets = await tweetService.getTweets();
//   const testTweet = tweets.find((tweet) => tweet.description === desc);
//   if(testTweet){ //Ensures that testTweet is not undefined
//     testTweet.numberOfLikes = 5;
//   tweetService.likeTweet(testTweet.id);
//   expect(testTweet.numberOfLikes === 6)
//   }
// })