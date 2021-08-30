import Queue from "./Queue";
import Redis = require("ioredis");
import {config,request} from "./index";

class Throttler{
    keyMap:Object;
    noSlots:number;
    configObject:config;
    queue:Queue<request>;


    constructor(configObject:config,noSlots) {
        this.keyMap = {}
        this.queue = new Queue<request>()
        this.configObject = configObject
        this.noSlots = noSlots
    }

    async step(request: request){
        const redis = new Redis()

        // as this is being triggered explicitly
        // hence a request may remain queued indefinitely if a new request
        // doesn't come in. Add a timer function to make sure that the request
        // is dequeued automatically
        let temp:request = request
        request = this.queue.peek() ? this.queue.peek() : temp

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

        request.key = request.key + ':' + currentSlot
        let value = await redis.get(request.key)

        if(value === null || value < this.configObject.numberOfRequests){

            redis
                .multi()
                .incr(request.key)
                .expire(request.key,expireIntervalInSeconds)
                .exec()

            if (temp !== request){
                this.queue.dequeue()
                this.queue.enqueue(temp)
            }
            return true //200
        }else{
            this.queue.enqueue(temp)
            return false //404
        }
    }


}


export default Queue;