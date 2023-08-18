import Redis = require("ioredis");

export class MyRedisStorage implements RateLimiter<string, number>{
    private redis;

    constructor(){
        this.redis = new Redis()
    }

    getValue(key: string): number {
        return this.redis.set('key', 100, 'EX', 10)
    }

    //to be implemented
    setValue(key: string, value: number): boolean {
        return true
    }
}