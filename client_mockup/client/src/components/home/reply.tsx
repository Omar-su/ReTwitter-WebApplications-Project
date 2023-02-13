
interface ReplyProps{
  key : number;
  id : number
  author : string;
  description : string
  numberOfLikes : number;
  numberOfReplies : number;
  children?: React.ReactNode;
  origowner : string;
}

function ReplyItem({key, id, author, description, numberOfLikes, numberOfReplies, children, origowner} : ReplyProps){
  return <div>
    <img src="" alt="" />
    <i>This is a reply to {id}</i>
    <div className='reply-info'>
      <p className='id'>{id}</p>
      <b className="origowner">{origowner}</b>
      <p className='author'>{author}</p>
      <p className='reply-description'>{description}</p>
      <div>
        <span>{numberOfReplies}</span>
        <span>{numberOfReplies}</span>
      </div>
    </div>
  </div>
}

export default ReplyItem;