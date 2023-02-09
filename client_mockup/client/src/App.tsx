import React, {useEffect, useState} from 'react';
import './App.css';
import axios from 'axios';

interface Tweet {
  id : number;
  description : string
}

function App() {
  const[tweets, setTweets] = useState<Tweet[]>([]);

  useEffect(()=>{
    async function updateTweets(){
      const response = await axios.get<Tweet[]>("http://localhost:9090/tweet");
      setTweets(response.data);
    }

    updateTweets();
  }, [tweets]);



  return (
    <div>
      <h1>Tweet list</h1>
      <ul>
        {tweets.map((tweet) => <TweetItem key = {tweet.id} description = {tweet.description} />)}
      </ul>
    </div>
  );
}

interface TweetItemProps{
  key : number;
  description : string
}

function TweetItem({description} : TweetItemProps){
  return <li>{description}</li>
}

export default App;
