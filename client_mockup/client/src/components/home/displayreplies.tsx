import React, {useState} from 'react';
import { RepliesToTweet } from './HomePage';
import { RepliesToTweetProps } from './HomePage';

export function ReplyDisplayerButton({id, replies} : RepliesToTweetProps){
  const [repliesDisplayed, setRepliesDisplay] = useState<boolean>(false);

  return <span>
    <button className="reply-displayer" onClick={ async () => { 
      setRepliesDisplay(!repliesDisplayed);
    }}> {repliesDisplayed ? 'Hide replies' : 'Display replies'} </button>
    {repliesDisplayed && <RepliesToTweet id={id} replies={replies}></RepliesToTweet>}

  </span>
}