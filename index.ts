import RateLimiter from "./RateLimiter";
import Throttler from "./Throttler";

export interface config {
    numberOfRequests:number,
    interval: number,
    resolution: string,
    mode?: string
}

export interface request {
    key:string,
    url:string,
}

module.exports.rimeter = function (config:config){

   let noSlots ;
    if (config.resolution === 's'){
        config.interval = config.interval < 59 && config.interval > 1 ? config.interval:1
        noSlots = Math.ceil(60/config.interval)
    }
    else if (config.resolution === 'm'){
        config.interval = config.interval < 59 && config.interval > 1 ? config.interval:1
        noSlots = Math.ceil(60/config.interval)
    }
    else if (config.resolution === 'h'){
        config.interval = config.interval < 24 && config.interval > 1 ? config.interval:1
        noSlots = Math.ceil(24/config.interval)
    }else{
        //throw an exception saying that none of the resolution provided were not correct
        throw "Resolution matches none of the allowed"

    }

    if(this.mode === "throttle"){
        return new Throttler(config,noSlots)
    }else{
        return new RateLimiter(config,noSlots)
    }
}