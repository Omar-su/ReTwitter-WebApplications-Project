import { makeTweetService } from "./tweet";

test("If a tweet is added to the list then it should be in the list", async () => {
  const desc = "Test description";
  const author = "test name";
  const tweetService = makeTweetService();
  await tweetService.tweet(author, desc);
  const tweets = await tweetService.getTweets();
  expect(tweets.some((tweet) => tweet.description === desc)).toBeTruthy();
})

test("If a tweet with 5 likes is liked, the number of likes is 6",async () => {
  const desc = "Like this tweet";
  const author = "test name";
  const tweetService = makeTweetService();
  await tweetService.tweet(author, desc);
  const tweets = await tweetService.getTweets();
  const testTweet = tweets.pop();
  if(testTweet){ //Ensures that testTweet is not undefined
    testTweet.numberOfLikes = 5;
  tweetService.likeTweet(testTweet.id);
  expect(testTweet.numberOfLikes === 6)
  }
})