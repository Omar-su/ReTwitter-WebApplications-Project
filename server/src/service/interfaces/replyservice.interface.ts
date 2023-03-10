import { ReplyInterface } from "../../model/interfaces/reply.interface";
import { UserInterface } from "../../model/interfaces/user.interface";

export interface ReplyServiceInterface {

    /**
     * Create a reply with the given author and description and owner of tweet being
     * replied to and add it to authors list of tweets. Return the created reply
     */
    createReply(author : string, description : string, ownerOfTweet : string): Promise<ReplyInterface>;

    
    getRepliesOnTweet(id : number) : Promise<ReplyInterface[] | null>;

    likeOrUnlikeReply(foundUser : UserInterface, id : number) : Promise<boolean>;

    replyOnReply(foundUser : UserInterface, id : number, desc : string) : Promise<boolean>;
}