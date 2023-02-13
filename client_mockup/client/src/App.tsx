import React, {useEffect, useState} from 'react';
import axios from 'axios';
import TweetButton from './components/home/tweetbutton';
import './App.css';
import ReplyButton from './components/home/replybutton';
import ReplyItem from './components/home/reply';

interface Tweet {
  id : number;
  author : string;
  description : string
  numberOfLikes : number;
  numberOfReplies : number;
  replies : Reply[];
}

interface Reply {
  id : number;
  author : string;
  description : string
  numberOfLikes : number;
  numberOfReplies : number;
  userNameOfOriginalTweet : string;
}


function App() {
  const[tweets, setTweets] = useState<Tweet[]>([]);

  async function updateTweets(){
    const response = await axios.get<Tweet[]>("http://localhost:9090/tweet");
    setTweets(response.data);
  }

  useEffect(()=>{
    updateTweets();
  }, []);



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
      </div>
      <div className='reply'>
        <div>
          <ReplyButton tweetId={id}></ReplyButton>
        </div>
        <div>
            {replies && replies.length > 0 && replies.map((reply) => (<ReplyItem key={reply.id} id={reply.id} author={reply.author} description={reply.description} numberOfLikes={reply.numberOfLikes} numberOfReplies={reply.numberOfReplies} origowner={reply.userNameOfOriginalTweet}></ReplyItem>))}
        </div>
          
      </div>
    </div>
  </div>
}




export default App;
