import React, {useState} from 'react';
import { RepliesToTweet } from './TweetItem';
import { RepliesToTweetProps } from './TweetItem';
import axios from 'axios';
import './TweetButton.css'; 
import { Reply } from '../../Interfaces';
import Button from 'react-bootstrap/Button';

axios.defaults.withCredentials = true

export function ReplyDisplayerButton({id, replies} : RepliesToTweetProps){
  const [repliesDisplayed, setRepliesDisplay] = useState<boolean>(false);
  const [repliesData, setReplies] = useState<Reply[]>([]);

  return <span>
    <Button variant="dark" onClick={ async () => { 
      const response = await axios.get<Reply[]>(`http://localhost:9090/reply/feed/replies/${id}`);
      setReplies(response.data);
      setRepliesDisplay(!repliesDisplayed);
    }}>{repliesDisplayed ? 'Hide replies' : 'Display replies'} </Button>
    {repliesDisplayed && <RepliesToTweet id={id} replies={repliesData}></RepliesToTweet>}

  </span>
}