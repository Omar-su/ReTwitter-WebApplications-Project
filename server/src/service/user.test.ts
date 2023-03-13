import { before } from "node:test";
import { getDatabaseModels } from "../db/connect_database";
import { connUrlTest } from "../db/conn_url_origin";
import { makeTweetDBService } from "./db/TweetDBService";
import { makeUserDBService } from "./db/UserDBService";
import { TweetServiceInterface } from "./interfaces/tweetservice.interface";
import { UserServiceInterface } from "./interfaces/userservice.interface";

const testUserName = "testuser";
let userService!: UserServiceInterface;
let tweetService!: TweetServiceInterface;
let databaseModels = getDatabaseModels(connUrlTest);

beforeEach(async () => {
    userService = makeUserDBService(databaseModels);
    tweetService = makeTweetDBService(databaseModels);
    //   await userService.createUser(testUserName, "testownername", "testbio", "test@test.com", "testpassword");
});

test("If a user follows another user, the correct user should be in the correct lists", async () => {
    const userNameForFollower = "thisuserwillfollow";
    const userNameForToBeFollowed = "thisuserwillbefollowed";

    await userService.createUser(userNameForFollower, "follower",
        "i like to follow", "follower@follower.com", "follower");
    await userService.createUser(userNameForToBeFollowed, "followed",
        "i like to be followed", "followed@followed.com", "followed");

    await userService.followProfile(userNameForToBeFollowed, userNameForFollower);

    const userFollowing = await userService.findUserByUsername(userNameForFollower);
    const userToBeFollowed = await userService.findUserByUsername(userNameForToBeFollowed);

    if(userFollowing && userToBeFollowed){
        expect(userFollowing.following.includes(userNameForToBeFollowed) 
        && userToBeFollowed.followers.includes(userNameForFollower));
    }
});

test("If a user unfollows another user, the users should not be in eachothers lists ", async () => {
    const userNameForUnFollower = "thisuserwillunfollow";
    const userNameForToBeUnFollowed = "thisuserwillbeunfollowed";
    
    await userService.createUser(userNameForUnFollower, "follower",
        "i like to follow", "follower@follower.com", "follower");
    await userService.createUser(userNameForToBeUnFollowed, "followed",
        "i like to be followed", "followed@followed.com", "followed");

    // First they need to follow
    await userService.followProfile(userNameForToBeUnFollowed, userNameForUnFollower);
    const userUnfollowing = await userService.findUserByUsername(userNameForUnFollower);
    const userToBeUnFollowed = await userService.findUserByUsername(userNameForToBeUnFollowed);

    if(userUnfollowing && userToBeUnFollowed){
        // Make sure that they are following
        if(userUnfollowing.following.includes(userNameForToBeUnFollowed) 
        && userToBeUnFollowed.followers.includes(userNameForUnFollower)){
            userService.unfollowProfile(userNameForToBeUnFollowed, userNameForUnFollower);
            expect(!userToBeUnFollowed.followers.includes(userNameForUnFollower)
            && !userUnfollowing.following.includes(userNameForToBeUnFollowed));
        }
    }
});

afterEach(async () => {
    if (databaseModels.getReplyModel().db.name == "db_for_unit_tests") {
        await databaseModels.getReplyModel().deleteMany({});
    }
    if (databaseModels.getTweetModel().db.name == "db_for_unit_tests") {
        await databaseModels.getTweetModel().deleteMany();
    }
    if (databaseModels.getUserModel().db.name == "db_for_unit_tests") {
        await databaseModels.getUserModel().deleteMany({});
    }
});