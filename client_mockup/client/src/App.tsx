import React, {useEffect, useState} from 'react';
import axios from 'axios';
import TweetButton from './Components/Home/tweetbutton';
import './App.css';
import ReplyButton from './Components/Home/replybutton';
import ReplyItem from './Components/Home/reply';
import { Tweet, Reply } from './Interfaces';



function App() {
  const[tweets, setTweets] = useState<Tweet[]>([]);

  async function updateTweets(){
    const response = await axios.get<Tweet[]>("http://localhost:9090/tweet");
    setTweets(response.data);
  }

  useEffect(()=>{
    console.log("called");
    updateTweets();
  }, [tweets]);


  return (
    <div>
      <h1>Tweet Feed</h1>
      <div>
        <TweetButton></TweetButton>
      </div>
      <div>
        {tweets.map((tweet) => <TweetItem key={tweet.id} id={tweet.id} 
        replies={tweet.replies} author = {tweet.author} description = {tweet.description} 
        numberOfLikes={ async () => {
          await axios.post(`http://localhost:9090/tweet/${tweet.id}`);
          updateTweets();
        }} numberOfReplies={tweet.numberOfReplies}>{tweet.numberOfLikes}</TweetItem> 
        )}
      </div>
    </div>
  );
}

//Interface for tweet item
interface TweetItemProps{
  key : number;
  id : number;
  author : string;
  description : string
  numberOfLikes : () => Promise<void>;
  numberOfReplies : number;
  children?: React.ReactNode
  replies : Reply[];
}

export function TweetItem({key, id, author, description, numberOfLikes, numberOfReplies, children, replies} : TweetItemProps){
  console.log("hello key : " + id);
  return <div>
    <img src="" alt="" />
    <div className='tweet-info'>
      <p className='id'>{id}</p>
      <p className='author'>{author}</p>
      <p className='tweet-description'>{description}</p>
      <div>
        <button onClick={numberOfLikes}>
          {children}
        </button>
        <span>{numberOfReplies}</span>
        <div>
          <ReplyButton id={id} replies={replies}></ReplyButton>
        </div>
      </div>
    </div>
  </div>
}

export interface RepliesToTweetProps{
  id : number;
  replies : Reply[];
}

export function RepliesToTweet({id, replies}:RepliesToTweetProps){
  return <div className='reply'>
    <div>
        {replies && replies.length > 0 && replies.map((reply) => (<ReplyItem key={reply.id} id={reply.id} author={reply.author} origTweetId={id} description={reply.description} replies={reply.replies} numberOfReplies={reply.numberOfReplies} origowner={reply.userNameOfOriginalTweet} numberOfLikes={ async () => {
        await axios.post(`http://localhost:9090/tweet/${reply.id}`);
        }}>{reply.numberOfLikes}
      </ReplyItem>))}
    </div>
      
  </div>

}


export default App;