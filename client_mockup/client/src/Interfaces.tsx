export interface Tweet {
    id : number;
    author : string;
    description : string
    numberOfLikes : number;
    numberOfReplies : number;
    replies : Reply[];
  }
  
  export interface Reply {
    id : number;
    author : string;
    description : string
    numberOfLikes : number;
    numberOfReplies : number;
    userNameOfOriginalTweet : string;
    replies : Reply[];
  }

export interface User {
    userNameID: string;
    ownerName: string;
    bio: string;
    followers: User[];
    following: User[];
    tweets: Tweet[];
  }
