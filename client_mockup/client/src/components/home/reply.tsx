import ReplyForm from "./replybutton";
import { Reply } from "../../Interfaces";
import Button from 'react-bootstrap/Button';

interface ReplyProps{
  key : number;
  id : number;
  origTweetId : number;
  author : string;
  description : string
  numberOfLikes : () => Promise<void>;
  numberOfReplies : number;
  children?: React.ReactNode;
  origowner : string;
  replies : Reply[]
}

function ReplyItem({key, id, origTweetId, author, description, numberOfLikes, numberOfReplies, children, origowner, replies} : ReplyProps){
  return <div className='reply-item'>
    <img src="" alt="" />
    <div className='reply-info'>
      <h4 className='author'>{"@" + author}</h4>
      <p className='reply-desc'>{description}</p>
      <div>
        <Button variant="secondary" onClick={numberOfLikes}>{children}</Button>
        <Button variant="info" disabled>{numberOfReplies}</Button>
      </div>
      <div>
          <ReplyForm id={id} replies={replies}></ReplyForm>
      </div>
    </div>

  </div>
}

export default ReplyItem;