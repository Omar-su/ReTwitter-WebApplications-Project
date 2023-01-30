import * as SuperTest from "supertest";
import { app } from "./start";
import { Tweet } from "./model/tweet";

const request = SuperTest.default(app);

test("End-to-end test", async () => {
    const description = "Test description";
    const author = "author test";
    const res1 = await request.put("/tweet").send({author: author, description : description});
    expect(res1.statusCode).toEqual(201);
    expect(res1.body.description).toEqual(description);
    const res2 = await request.get("/tweet");
    expect(res2.statusCode).toEqual(200);
    expect(res2.body.map((tweet : Tweet) => tweet.description)).toContain(description);
});