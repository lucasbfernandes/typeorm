import {Connection} from "../../../src";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {User} from "./entity/User";
import {Photo} from "./entity/Photo";

describe("github issues > #2044 Should not double get embedded column value", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["mysql"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("Insert query should work with relational columns", () => Promise.all(connections.map(async connection => {
        let userId = "1234";
        let photoId = "4321";

        const user = new User();
        user.id = userId;
        user.age = 25;
        await connection.manager.save(user);

        const photo = new Photo();
        photo.id = photoId;
        photo.description = "Tall trees";
        photo.user = user;
        await connection.manager.save(photo);

        const photos = await connection.manager.find(Photo, {
            relations: ["user"]
        });
        // console.log(photos);

        const resultPhoto = photos[0];

        expect(resultPhoto.id).toEqual(photoId);
        expect(resultPhoto.user.id).toEqual(userId);
    })));

});