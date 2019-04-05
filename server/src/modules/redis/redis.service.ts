import { Injectable } from "@nestjs/common"
import * as Redis from "ioredis"

@Injectable()
export class RedisService {
  redis = new Redis(process.env.REDIS || "6379")
}
