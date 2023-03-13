import React, { useEffect, useState } from 'react';
import axios from 'axios';
import twitterImage from "../util/images/twitter_test_image.png";
import './Home.css';
import ReplyItem from './reply';
import TweetButton from './TweetButton';
import ReplyForm from './replybutton';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Tweet, Reply } from '../../Interfaces';
import { TweetsContext } from './TweetsContext';
import Button from 'react-bootstrap/Button';
import { MDBBtn } from 'mdb-react-ui-kit';


axios.defaults.withCredentials = true

export function TweetPage() {
  const [tweets, setTweets] = useState<Tweet[]>([]);

  async function updateTweets() {
    const response = await axios.get<Tweet[]>("http://localhost:9090/tweet");
    setTweets(response.data);
  }

  useEffect(() => {
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
          replies={tweet.replies} author={tweet.author} description={tweet.description}
          numberOfLikes={async () => {
            await axios.post(`http://localhost:9090/tweet/${tweet.id}`);
            updateTweets();
          }} numberOfReplies={tweet.numberOfReplies}>{tweet.numberOfLikes}
        </TweetItem>
        )}
      </div>
    </div>
  );
}

//Interface for tweet item
interface TweetItemProps {
  key: number;
  id: number;
  author: string;
  description: string
  numberOfLikes: () => Promise<void>;
  numberOfReplies: number;
  children?: React.ReactNode
  replies: Reply[];
}

export function TweetItem({ key, id, author, description, numberOfLikes, numberOfReplies, children, replies }: TweetItemProps) {
  console.log(author);
  return <div className='tweet'>
    <img src={twitterImage} alt="Account" className='tweet__image' />

    <div style={{ marginBottom: '20px' }} className='tweet-info'>
      {/* <p className='id' style={{ fontSize: '20px', fontWeight: 'bold' }}>{id}</p> */}
      <a href={"/profile/" + author} className='author' style={{ fontSize: '20px', fontWeight: 'bold' }} >{author}</a>
      <p className='tweet-description text-color tweet-desc' style={{ fontSize: '16px', marginBottom: '10px' }}>{description}</p>
      <p style={{ fontSize: '14px', color: 'grey' }}>{"2:34 PM - 16 Feb 2023"}</p>
      <div>
        <Button variant="secondary" onClick={numberOfLikes}>{children}</Button>
        {/* <button className={'button'} onClick={numberOfLikes}>
          {children}
        </button> */}
        <Button variant="info" disabled>{numberOfReplies}</Button>
        {/* <span style={{ fontSize: '14px', color: 'white' }}>{numberOfReplies}</span> */}
        <div>
          <ReplyForm id={id} replies={replies}></ReplyForm>
        </div>
        {/* <MDBBtn rounded className='mx-2' color='danger' onClick={async () => {
          await axios.delete(`http://localhost:9090/tweet/${id}`);
        }} >
          Delete Tweet
        </MDBBtn> */}
        <Button variant="outline-danger button-danger" onClick={async () => {
          await axios.delete(`http://localhost:9090/tweet/${id}`);
        }}>Delete Tweet</Button>
      </div>
    </div>
  </div>
}

export interface RepliesToTweetProps {
  id: number;
  replies: Reply[];
}

export function RepliesToTweet({ id, replies }: RepliesToTweetProps) {

  const [tweets, setTweets] = React.useContext(TweetsContext);

  async function updateTweets() {
    const response = await axios.get<Tweet[]>("http://localhost:9090/tweet");
    setTweets(response.data);
  }


  return <div >
    <div>
      {replies && replies.length > 0 && replies.map((reply) => (<ReplyItem key={reply.id} id={reply.id} author={reply.author} origTweetId={id} description={reply.description} replies={reply.replies} numberOfReplies={reply.numberOfReplies} origowner={reply.userNameOfOriginalTweet} numberOfLikes={async () => {
        await axios.post(`http://localhost:9090/tweet/${reply.id}`);
        updateTweets();
      }}>{reply.numberOfLikes}
      </ReplyItem>))}
    </div>

  </div>

}


export default TweetPage;