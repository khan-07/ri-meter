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
    step(key){
        //Get data from keyMap using key:sec/min/hour number
        //if the results is less than this.configObject.numberOfRequests goto * otherwise goto +
        //+ Show Error Message and exit

        //* MULTI - represents a redis transaction
        // INCR key:resolution
        // EXPIRE key:resolution slotNo * interval
        // End

        //api responses

    }

}

export  default RateLimiter;