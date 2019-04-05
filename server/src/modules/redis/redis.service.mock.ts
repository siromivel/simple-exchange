import { Injectable } from "@nestjs/common"
import * as Redis from "ioredis-mock"

@Injectable()
export class RedisService {
  redis = new Redis()
}
