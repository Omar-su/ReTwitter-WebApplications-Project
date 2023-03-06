import {useState} from 'react';
import axios from 'axios';
import { Reply } from '../../Interfaces';
import { ReplyDisplayerButton } from './displayreplies';

axios.defaults.withCredentials = true

interface ReplyButtonProps{
  id : number;
  replies : Reply[];
}

function ReplyForm({id, replies}: ReplyButtonProps){

  const [description, setDescription] = useState<string>("");

  return <div>
    <form onSubmit={async e => {
      e.preventDefault();
    }}>
      <input type="text" className='description' name='descripition' onChange={async e => {
        setDescription(e.target.value);
      }} />
    </form>
    <button className='reply-button' onClick={async () => {
      await axios.post(`http://localhost:9090/tweet/reply/${id}`, {description : description});
    }}>Reply</button>
    <ReplyDisplayerButton id={id} replies={replies}></ReplyDisplayerButton>
  </div>
}


export default ReplyForm;