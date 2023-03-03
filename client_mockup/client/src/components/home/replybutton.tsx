import {useState} from 'react';
import axios from 'axios';
import { Reply } from '../../Interfaces';
import { ReplyDisplayerButton } from './DisplayReplies';
axios.defaults.withCredentials = true

interface ReplyButtonProps{
  id : number;
  replies : Reply[];
}

function ReplyForm({id, replies}: ReplyButtonProps){

  const [author, setAuthor] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [origowner, setOrigOwner] = useState<string>("");

  return <div>
    <form onSubmit={async e => {
      e.preventDefault();
    }}>
      {/* <input type="text" className='author' name='author' onChange={async e => {
        setAuthor(e.target.value);
      }} /> */}
      <input type="text" className='description' name='descripition' onChange={async e => {
        setDescription(e.target.value);
      }} />
    </form>
    <button className='reply-button' onClick={async () => {
      await axios.post(`http://localhost:9090/tweet/reply/${id}`, {author : author, description : description});
    }}>Reply</button>
    <ReplyDisplayerButton id={id} replies={replies}></ReplyDisplayerButton>
  </div>
}


export default ReplyForm;