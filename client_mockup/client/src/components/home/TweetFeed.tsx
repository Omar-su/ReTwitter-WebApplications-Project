
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import twitterImage from "../util/images/twitter_test_image.png";
import './Home.css';
import './NavBar.css';
import TweetButton from './tweetbutton';
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
    updateTweets();
  }, [tweets]);

  tweets.map((tweet) => {
    console.log(tweet.author);
  })
  
  return (
    <div style={{ marginTop: '20px' }}>
      <h1 className='tweet-feed'>Tweet Feed</h1>
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
              updateTweets();
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