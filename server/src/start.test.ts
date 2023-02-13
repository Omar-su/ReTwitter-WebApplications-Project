import * as SuperTest from "supertest";
import { app } from "./start";
import { Tweet } from "./model/tweet";

const request = SuperTest.default(app);

test("End-to-end test", async () => {
    const description = "Test description";
    const author = "author test";
    const res1 = await request.post("/tweet").send({author: author, description : description});
    expect(res1.statusCode).toEqual(201);
    expect(res1.body.description).toEqual(description);
    const res2 = await request.get("/tweet");
    expect(res2.statusCode).toEqual(200);
    expect(res2.body.map((tweet : Tweet) => tweet.description)).toContain(description);
});

test("Follow test", async () => {
    const userID1 = "account1";
    const ownerName1 = "owner1";
    const bio1 = "bio1"

    const userID2 = "account2";
    const ownerName2 = "owner2";
    const bio2 = "bio2"

    const createRes1 = await request.post("/newuser").send({userID: userID1, ownerName : ownerName1,
    bio : bio1});
    expect(createRes1.statusCode).toEqual(201);

    const createRes2 = await request.post("/newuser").send({userID: userID2, ownerName : ownerName2,
        bio : bio2});
        expect(createRes2.statusCode).toEqual(201);


    const followRes = await request.post("/profile/account1/follow").send({followee: userID1,
        follower: userID2});
        expect(followRes.statusCode).toEqual(200);

    const profilesRes = await request.get("/profiles");
    expect(profilesRes.statusCode).toEqual(200);
    
    const followedAccount = profilesRes.body.find((profile: { userNameID: string; }) => 
    {return profile.userNameID === userID1});
    expect(followedAccount.getFollowers === 1);

    const followingAccount = profilesRes.body.find((profile: { userNameID: string; }) => 
    {return profile.userNameID === userID2});
    expect(followingAccount.following === 1);


});