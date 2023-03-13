import { ReplyInterface } from "../../model/interfaces/reply.interface";
import { TweetInterface } from "../../model/interfaces/tweet.interface";
import { UserInterface } from "../../model/interfaces/user.interface";

export interface TweetServiceInterface {

    /**
     * Returns a list of all the tweets in the application 
     */
    getTweets(): Promise<TweetInterface[]>;

    /**
     * Creates a tweet with the given author and description and adds it to the tweet
     * list of the given author. Returns the created tweet
     */
    createTweet(author: string, description: string): Promise<TweetInterface>;

    /**
     * Increases the like number for the tweet whit the given author and id.
     * Returns true if number is successfully increased
     * Returns false if tweet does not exist
     * @param tweetAuthor 
     * @param id 
     */
    likeOrUnlikeTweet(tweetAuthor: UserInterface, id: number): Promise<boolean>;

    /**
     * Deletes a tweet with the given author and id from authors list of tweets
     * Returns true if tweet is successfully deleted, otherwise returns false 
     */
    deleteTweet(tweetAuthor: UserInterface, id: number): Promise<boolean>;


    replyOnTweetOrReply(user: UserInterface, id: number, desc : string): Promise<boolean>;

}