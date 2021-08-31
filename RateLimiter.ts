import Redis = require("ioredis");
import {config} from "./index";

class RateLimiter{

    keyMap:Object;
    noSlots:number;
    configObject:config;
    redis:any;


    constructor(configObject:config,noSlots,redis) {
        this.keyMap = {};
        this.configObject = configObject
        this.noSlots = noSlots;
        this.redis = redis;

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

        if(this.redis){
            let request = await redis.get(key)

            if(request === null || request < this.configObject.numberOfRequests){

                this.redis.
                multi()
                    .incr(key)
                    .expire(key,expireIntervalInSeconds)
                    .exec()

                return true //200
            }else{
                return false //404
            }
        }else{
            if(this.keyMap.hasOwnProperty(key) && (this.keyMap[key] < this.configObject.numberOfRequests)){
                this.keyMap[key] = this.keyMap[key] + 1
            }else{
                this.keyMap[key] = 1
            }

            //need to make sure that there is only one expiry callback per key
            setTimeout(()=>{
                delete this.keyMap[key];
            },expireIntervalInSeconds*1000)
        }

    }

}

export  default RateLimiter;