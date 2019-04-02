import { Connection } from "typeorm";
import { Order } from "./order.entity";

export const orderProviders = [
    {
        provide: "OrderRepository",
        useFactory: (conn: Connection) => conn.getRepository(Order),
        inject: [Connection]
    }
]
