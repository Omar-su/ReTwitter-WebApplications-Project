
// Does not differ a lot from a tweet, however it is connected to a tweet

import { ReplyInterface } from "./interfaces/reply.interface";
import { Tweet } from "./tweet";

// Comment has a reference to the original tweet
class Reply extends Tweet implements ReplyInterface{

    userNameOfOriginalTweet : string;
    
    constructor( author : string, description : string, userNameOfOriginalTweet : string){
        super(author, description);
        this.userNameOfOriginalTweet = userNameOfOriginalTweet;
    }
}