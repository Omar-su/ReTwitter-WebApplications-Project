import { makeTweetService } from "./tweet";

test("If a tweet is added to the list then it should be in the list", async () => {
  const desc = "Test description";
  const author = "test name";
  const tweetService = makeTweetService();
  await tweetService.tweet(author, desc);
  const tweets = await tweetService.getTweets();
  expect(tweets.some((tweet) => tweet.description === desc)).toBeTruthy();
})