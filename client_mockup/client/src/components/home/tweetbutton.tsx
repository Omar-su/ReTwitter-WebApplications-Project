import React, {useEffect, useState} from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true

function TweetButton(){

  const [author, setAuthor] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  return <div style={{ 
    border: '1px solid black',
    padding: '10px',
    margin: '10px',
    backgroundColor: 'white',
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
  }}>
    <form onSubmit={async e => {
      e.preventDefault();
    }}>
      <input type="text" className='description' name='descripition' onChange={async e => {
        setDescription(e.target.value);
      }} />
    </form>
    <button className='tweet-button' onClick={async () => {
      await axios.post("http://localhost:9090/tweet", {description: description});
    }}>Tweet</button>
  </div>
}

export default TweetButton;





