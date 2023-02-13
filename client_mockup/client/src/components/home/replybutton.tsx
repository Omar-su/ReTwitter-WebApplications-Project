import React, {useEffect, useState} from 'react';
import axios from 'axios';

interface ReplyButtonProps{
  tweetId : number;
}

function ReplyButton({tweetId}: ReplyButtonProps){

  const [author, setAuthor] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [origowner, setOrigOwner] = useState<string>("");

  return <div>
    <form onSubmit={async e => {
      e.preventDefault();
    }}>
      <input type="text" className='author' name='author' onChange={async e => {
        setAuthor(e.target.value);
      }} />
      <input type="text" className='description' name='descripition' onChange={async e => {
        setDescription(e.target.value);
      }} />
      <input type="text" className='origowner' name='origowner' onChange={async e => {
        setOrigOwner(e.target.value);
      }} />
    </form>
    <button className='reply-button' onClick={async () => {
      await axios.post(`http://localhost:9090/tweet/reply/${tweetId}`, {author, description, origowner});
    }}>Reply</button>
  </div>
}

export default ReplyButton;