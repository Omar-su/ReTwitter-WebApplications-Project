import React, {Children, useEffect, useState} from 'react';
import axios from 'axios';

interface Tweet {
  id : number;
  author : string;
  description : string
  numberOfLikes : number;
  numberOfReplies : number;
}

function App() {
  const[tweets, setTweets] = useState<Tweet[]>([]);

  async function updateTweets(){
    const response = await axios.get<Tweet[]>("http://localhost:9090/tweet");
    setTweets(response.data);
  }

  useEffect(()=>{
    updateTweets();
  }, [tweets]);



  return (
    <div>
      <h1>Tweet Feed</h1>
      <div>
        {tweets.map((tweet) => <TweetItem key={tweet.id} author = {tweet.author} description = {tweet.description} 
        numberOfLikes={ async () => {
          await axios.post(`http://localhost:9090/tweet/${tweet.id}`);
          updateTweets();
        }} numberOfReplies={tweet.numberOfReplies}>{tweet.numberOfLikes}</TweetItem>)}
      </div>
    </div>
  );
}

interface TweetItemProps{
  key : number;
  author : string;
  description : string
  numberOfLikes : () => Promise<void>;
  numberOfReplies : number;
  children?: React.ReactNode
}

function TweetItem({key, author, description, numberOfLikes, numberOfReplies, children} : TweetItemProps){
  return <div>
    <img src="" alt="" />
    <div className='tweet-info'>
      <p className='id'>{key}</p>
      <p className='author'>{author}</p>
      <p className='tweet-description'>{description}</p>
      <div>
        <button onClick={numberOfLikes}>
          {children}
        </button>
        <span>{numberOfReplies}</span>
      </div>
    </div>
  </div>
}

export default App;