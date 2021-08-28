import Redis = require("ioredis");

interface config {
    numberOfRequests:number,
    interval: number,
    resolution: string
}

class RateLimiter{

    keyMap:Object;
    noSlots:number;
    configObject:config;
    constructor(configObject:config) {
        this.keyMap = {};
        this.configObject = configObject;
        if (configObject.resolution === 's'){
            configObject.interval = configObject.interval < 59 || configObject.interval > 1 ? configObject.interval:1
            this.noSlots = Math.ceil(60/configObject.interval)
        }
        else if (configObject.resolution === 'm'){
            configObject.interval = configObject.interval < 59 || configObject.interval > 1 ? configObject.interval:1
            this.noSlots = Math.ceil(60/configObject.interval)
        }
        else if (configObject.resolution === 'h'){
            configObject.interval = configObject.interval < 24 || configObject.interval > 1 ? configObject.interval:1
            this.noSlots = Math.ceil(24/configObject.interval)
        }else{
            //throw an exception saying that the value provided were not correct
            throw "Resolution matches none of the allowed"

        }

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