import React, {useEffect, useState} from 'react';
import axios from 'axios';

function TweetButton(){

  const [author, setAuthor] = useState<string>("");
  const [description, setDescription] = useState<string>("");

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
    </form>
    <button className='tweet-button' onClick={async () => {
      await axios.post("http://localhost:9090/tweet/", {author, description});
    }}>Tweet</button>
  </div>
}

export default TweetButton;





