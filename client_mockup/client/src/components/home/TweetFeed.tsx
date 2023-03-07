
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import twitterImage from "../util/images/twitter_test_image.png";
import './Home.css';
import ReplyItem from './reply';
import TweetButton from './TweetButton';
import ReplyForm from './replybutton';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TweetItem } from './TweetItem';
import { Tweet, User } from '../../Interfaces';

axios.defaults.withCredentials = true

export function TweetFeed() {
  const [tweets, setTweets] = useState<Tweet[]>([]);

  async function updateTweets() {
    const response = await axios.get<Tweet[]>("http://localhost:9090/tweet/feed");
    setTweets(response.data);
  }

  useEffect(() => {
    console.log("called ");
    updateTweets();
  }, []);
  tweets.map((tweet) => {
    console.log(tweet.author);
  })
  return (
    <div>
      <h1>Tweet Feed</h1>
      <div>
        <TweetButton></TweetButton>
      </div>
      <div>
        {tweets.map((tweet) =>
          <TweetItem
            key={tweet.id}
            id={tweet.id}
            replies={tweet.replies}
            author={tweet.author}
            description={tweet.description}
            numberOfLikes={async () => {
              await axios.post(`http://localhost:9090/tweet/${tweet.id}`);
            }}
            numberOfReplies={tweet.numberOfReplies}
          >
            {tweet.numberOfLikes}
          </TweetItem>
        )}
      </div>
    </div>
  );


}