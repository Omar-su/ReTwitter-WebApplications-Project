import { TweetInterface } from "../../model/interfaces/tweet.interface";
import { UserInterface } from "../../model/interfaces/user.interface";

export interface UserServiceInterface {
    /**
     * Return the list of registered users
     */
    getUsers() : Promise<UserInterface[]>;

    /**
     * Create a user with given username, owner name, email and password
     * and add it to registered users
     * Return true if user is successfully created
     * Return false if there is already a user with the given username or email
     * or if there was an error in creating the user
     */
    createUser(userNameID: string, ownerName: string, email:string, password:string): Promise<boolean>;

    /**
     * Return user with given email and password
     * If there is no user with the given email and password, return null
     */
    findUserByEmailAndPwd(email: string, password: string): Promise<UserInterface | null>;
    
    /**
     * Return user with given user_id
     * If there is no user with the given id, return null
     */
    findUserByID(user_id: string): Promise<UserInterface | null>;

    /**
     * Return user with given username
     * If there is no user with the given username, return null
     */
    findUserByUsername(userName: string): Promise<UserInterface | null>;

    /**
     * Return the list of tweets posted by the given user
     * If the given user does not exist, return null
     */
    getUserTweets(user: UserInterface): Promise<Array<TweetInterface> | null>;

    /**
     * Return a list of tweets with tweets from the given user as well as tweets
     * from all the accounts that the given user follows
     * If given user does not exist, return null
     */
    getFollowingTweets(user: UserInterface): Promise<Array<TweetInterface> | null>;

    /**
     * Return the list of users following the given user
     * If given user does not exist, return null
     */
    getUsersFollowers(user: UserInterface): Promise<Array<string> | null>;

    /**
     * Return the list of users followed by the given user
     * If given user does not exist, return null
     */
    getUsersFollowing(user: UserInterface): Promise<Array<string> | null>;

    /**
     * Adds the user with username userNameBeingFollowed to the following list of user with
     * id user_idFollowing. Also adds the user with id user_idFollowing to list of
     * followers for user with username userNameBeingFollowed. After this, return true
     * If either of the users do not exist, return false
     */
    followProfile(userNameBeingFollowed: string, user_idFollowing: string): Promise<boolean>;

    /**
     * Removes the user with username toBeUnfollowedUserName from the following list of user with
     * id userUnfollowingId. Also removes the user with id userUnfollowingId from list of
     * followers for user with username toBeUnfollowedUsername. After this, return true
     * If either of the users do not exist, return false
     */
    unfollowProfile(toBeUnfollowedUserName: string, userUnfollowingId: string): Promise<boolean>;

    /**
     * Updates the information for the given user object if it exists in the database
     * Return the newly updated user.
     */
    updateUser(user: UserInterface): Promise<UserInterface | null>
}