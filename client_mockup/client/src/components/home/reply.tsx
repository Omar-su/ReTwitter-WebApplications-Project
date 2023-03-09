import ReplyForm from "./replybutton";
import { Reply } from "../../Interfaces";

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
  return <div style={{ 
    border: '1px solid black',
    padding: '10px',
    margin: '10px',
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center'
  }} className='reply'>
    <img src="" alt="" />
    <div className='reply-info'>
      {/* <h3 className="origowner">{origowner}</h3> */}
      <h3 className='author'>{author}</h3>
      <p className='reply-description'>{description}</p>
      <div>
        <button onClick={numberOfLikes}>
          {children}
        </button>
        <span>{numberOfReplies}</span>
      </div>
      <div>
          <ReplyForm id={id} replies={replies}></ReplyForm>
      </div>
    </div>

  </div>
}

export default ReplyItem;