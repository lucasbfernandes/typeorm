import "reflect-metadata";
import {Post} from "./entity/Post";
import {Image} from "./entity/Image";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../utils/test-utils";
import {Connection} from "../../../../../src";

describe("query builder > relational with many > load many", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should load relation entity of a given entity object", () => Promise.all(connections.map(async connection => {

        const image1 = new Image();
        image1.url = "image #1";
        await connection.manager.save(image1);

        const image2 = new Image();
        image2.url = "image #2";
        await connection.manager.save(image2);

        const image3 = new Image();
        image3.url = "image #3";
        await connection.manager.save(image3);

        const post1 = new Post();
        post1.title = "post #1";
        post1.images = [image1, image2];
        await connection.manager.save(post1);

        const post2 = new Post();
        post2.title = "post #2";
        post2.images = [image2, image3];
        await connection.manager.save(post2);

        const post3 = new Post();
        post3.title = "post #3";
        post3.images = [image1, image3];
        await connection.manager.save(post3);

        const loadedPost1 = await connection.manager.findOne(Post, 1);
        loadedPost1!.images = await connection
            .createQueryBuilder()
            .relation(Post, "images")
            .of(post1)
            .loadMany();

        expect(loadedPost1!.images).toContainEqual({ id: 1, url: "image #1" });
        expect(loadedPost1!.images).toContainEqual({ id: 2, url: "image #2" });
        expect(loadedPost1!.images).not.toContain({ id: 3, url: "image #3" });
    })));

    test("should load relation entity of a given entity id map", () => Promise.all(connections.map(async connection => {

        const image1 = new Image();
        image1.url = "image #1";
        await connection.manager.save(image1);

        const image2 = new Image();
        image2.url = "image #2";
        await connection.manager.save(image2);

        const image3 = new Image();
        image3.url = "image #3";
        await connection.manager.save(image3);

        const post1 = new Post();
        post1.title = "post #1";
        post1.images = [image1, image2];
        await connection.manager.save(post1);

        const post2 = new Post();
        post2.title = "post #2";
        post2.images = [image2, image3];
        await connection.manager.save(post2);

        const post3 = new Post();
        post3.title = "post #3";
        post3.images = [image1, image3];
        await connection.manager.save(post3);

        const loadedPost1 = await connection.manager.findOne(Post, 1);
        loadedPost1!.images = await connection
            .createQueryBuilder()
            .relation(Post, "images")
            .of({ id: 1 })
            .loadMany();

        expect(loadedPost1!.images).toContainEqual({ id: 1, url: "image #1" });
        expect(loadedPost1!.images).toContainEqual({ id: 2, url: "image #2" });
        expect(loadedPost1!.images).not.toContain({ id: 3, url: "image #3" });
    })));

    test("should load relation entity of a given entity id", () => Promise.all(connections.map(async connection => {

        const image1 = new Image();
        image1.url = "image #1";
        await connection.manager.save(image1);

        const image2 = new Image();
        image2.url = "image #2";
        await connection.manager.save(image2);

        const image3 = new Image();
        image3.url = "image #3";
        await connection.manager.save(image3);

        const post1 = new Post();
        post1.title = "post #1";
        post1.images = [image1, image2];
        await connection.manager.save(post1);

        const post2 = new Post();
        post2.title = "post #2";
        post2.images = [image2, image3];
        await connection.manager.save(post2);

        const post3 = new Post();
        post3.title = "post #3";
        post3.images = [image1, image3];
        await connection.manager.save(post3);

        const loadedPost1 = await connection.manager.findOne(Post, 1);
        loadedPost1!.images = await connection
            .createQueryBuilder()
            .relation(Post, "images")
            .of(1)
            .loadMany();

        expect(loadedPost1!.images).toContainEqual({ id: 1, url: "image #1" });
        expect(loadedPost1!.images).toContainEqual({ id: 2, url: "image #2" });
        expect(loadedPost1!.images).not.toContain({ id: 3, url: "image #3" });
    })));

});