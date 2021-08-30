import Redis = require("ioredis");
import Queue from "./Queue";
import {config,request} from "./index";

class RateLimiter{

    keyMap:Object;
    noSlots:number;
    configObject:config;
    queue:Queue<request>;


    constructor(configObject:config,noSlots) {
        this.keyMap = {};
        this.configObject = configObject
        this.noSlots = noSlots;

    }

    //this function is always called whenever a request is made
    async step(key){

        const redis = new Redis()

        let currentSlot
        let expireIntervalInSeconds

        let date = new Date()
        if(this.configObject.resolution  === 's'){
            currentSlot = Math.ceil((date.getSeconds() + 1)/this.configObject.interval)
            expireIntervalInSeconds = this.configObject.interval

        }
        if(this.configObject.resolution  === 'm'){
            currentSlot = Math.ceil((date.getMinutes() + 1)/this.configObject.interval)
            expireIntervalInSeconds = this.configObject.interval * 60


        }
        if(this.configObject.resolution  === 'h'){
            currentSlot = Math.ceil((date.getHours() + 1)/this.configObject.interval)
            expireIntervalInSeconds = this.configObject.interval * 60 * 60

        }

        key = key + ':' + currentSlot
        let request = await redis.get(key)

        if(request === null || request < this.configObject.numberOfRequests){

            redis
                .multi()
                .incr(key)
                .expire(key,expireIntervalInSeconds)
                .exec()

            return true //200
        }else{
            return false //404
        }

    }

}

export  default RateLimiter;