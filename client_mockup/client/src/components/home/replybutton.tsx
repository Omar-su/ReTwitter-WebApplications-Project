import {useState} from 'react';
import axios from 'axios';
import { Reply } from '../../Interfaces';
import { ReplyDisplayerButton } from './DisplayReplies';
import './TweetButton.css'; 
import Button from 'react-bootstrap/Button';

axios.defaults.withCredentials = true

interface ReplyButtonProps{
  id : number;
  replies : Reply[];
}

function ReplyForm({id, replies}: ReplyButtonProps){

  const [description, setDescription] = useState<string>("");

  return <span>
    <form onSubmit={async e => {
      e.preventDefault();
    }}>
      <input type="text" className='dark-form' name='descripition' onChange={async e => {
        setDescription(e.target.value);
      }} />
    </form>
    <Button variant="primary" onClick={async () => {
      await axios.post(`http://localhost:9090/reply/${id}`, {description : description});
    }}>Reply</Button>
    <ReplyDisplayerButton id={id} replies={replies}></ReplyDisplayerButton>
  </span>
}


export default ReplyForm;