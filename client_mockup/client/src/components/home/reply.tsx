import ReplyButton from "./replybutton";
import { RepliesToTweet } from "../../App";
import { Reply } from "../../App";

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
          <ReplyButton id={id}></ReplyButton>
      </div>
    </div>
    <div>
        <RepliesToTweet id={id} replies={replies} ></RepliesToTweet>
    </div>

  </div>
}

export default ReplyItem;