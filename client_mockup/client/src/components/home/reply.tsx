import ReplyForm from "./replybutton";
import { Reply } from "../../App";
import { ReplyDisplayerButton } from "./displayreplies";

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
  return <div>
    <img src="" alt="" />
    <i>This is a reply to {origTweetId}</i>
    <div className='reply-info'>
      <p className='id'>{id}</p>
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