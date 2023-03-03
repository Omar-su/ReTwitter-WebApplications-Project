import ReplyForm from "./replybutton";
import { Reply } from "../../Interfaces";
import { ReplyDisplayerButton } from "./Displayreplies";

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
    backgroundColor: 'white',
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center'
  }}>
    <img src="" alt="" />
    <div className='reply-info'>
      <b className="origowner">{origowner}</b>
      <p className='author'>{author}</p>
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