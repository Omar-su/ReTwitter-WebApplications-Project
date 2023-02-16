import React, {useEffect, useState} from 'react';
import axios from 'axios';
import TweetButton from './components/home/tweetbutton';
import './App.css';
import ReplyButton from './components/home/replybutton';
import ReplyItem from './components/home/reply';
import twitterImage from "C:/Users/omars/Downloads/Webapplications_project/WebApplications-Project/client_mockup/client/src/components/util/images/twitter_test_image.png";

interface Tweet {
  id : number;
  author : string;
  description : string
  numberOfLikes : number;
  numberOfReplies : number;
  replies : Reply[];
}

export interface Reply {
  id : number;
  author : string;
  description : string
  numberOfLikes : number;
  numberOfReplies : number;
  userNameOfOriginalTweet : string;
  replies : Reply[];
}



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
        {tweets.map((tweet) => <TweetItem key={tweet.id} id={tweet.id} replies={tweet.replies} author = {tweet.author} description = {tweet.description} 
        numberOfLikes={ async () => {
          await axios.post(`http://localhost:9090/tweet/${tweet.id}`);
          updateTweets();
        }} numberOfReplies={tweet.numberOfReplies}>{tweet.numberOfLikes}</TweetItem> 
        )}
      </div>
    </div>
  );
}

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

function TweetItem({key, id, author, description, numberOfLikes, numberOfReplies, children, replies} : TweetItemProps){
  
  return <div className='tweet'>
    <img src={twitterImage} alt="Account" className='tweet__image'/>

    <div style={{ marginBottom: '20px'}} className='tweet-info'>
      <p className='id' style={{ fontSize: '20px', fontWeight: 'bold' }}>{id}</p>
      <p className='author' style={{ fontSize: '20px', fontWeight: 'bold' }} >{author}</p>
      <p className='tweet-description' style={{ fontSize: '16px', marginBottom: '10px' }}>{description}</p> 
      <p style={{ fontSize: '14px', color: 'grey' }}>{"2:34 PM - 16 Feb 2023"}</p>
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