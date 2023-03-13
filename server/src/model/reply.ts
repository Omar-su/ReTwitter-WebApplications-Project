
// Does not differ a lot from a tweet, however it is connected to a tweet

import { ReplyInterface } from "./interfaces/reply.interface";
import { Tweet } from "./tweet";

/**
 * A class which represents a comment on a tweet, very similar to the tweet class
 */
class Reply extends Tweet implements ReplyInterface{

    userNameOfOriginalTweet : string;
    
    constructor( author : string, description : string, userNameOfOriginalTweet : string){
        super(author, description);
        this.userNameOfOriginalTweet = userNameOfOriginalTweet;
    }
}