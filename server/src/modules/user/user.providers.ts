import { Connection } from "typeorm";
import { User } from "./user.entity";

export const userProviders = [
    {
        provide: "UserRepository",
        useFactory: (conn: Connection) => conn.getRepository(User),
        inject: [Connection]
    }
]
