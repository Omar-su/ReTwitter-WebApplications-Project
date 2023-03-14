import { ReplyInterface } from "../../model/interfaces/reply.interface";
import { UserInterface } from "../../model/interfaces/user.interface";

export interface ReplyServiceInterface {

    /**
     * Create a reply with the given author and description and owner of tweet being
     * replied to and add it to authors list of tweets. Return the created reply
     */
    createReply(author : string, description : string, ownerOfTweet : string): Promise<ReplyInterface>;

    /**
     * Returns the replies on a tweet with the given id
     */
    getRepliesOnTweet(id : number) : Promise<ReplyInterface[] | null>;

    /**
     * Toggles the like status of a given reply
     */
    likeOrUnlikeReply(foundUser : UserInterface, id : number) : Promise<boolean>;

    /**
     * Creates a reply on a given reply with the given description
     */
    replyOnReply(foundUser : UserInterface, id : number, desc : string) : Promise<boolean>;
}