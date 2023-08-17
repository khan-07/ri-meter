enum RateLimitingAlgorithm {
    TOKEN_BUCKET = "TOKEN_BUCKET",
}
/*Limiter will take in one of the following objects 
    - Any object that allows to set a key (method name to be decided)
    - Any object that allows to get a key  (method name to be decided)
    - 

    This class will only call the step function of whatever alogirthm was provided
    as an option 
*/
import { TokenBucket } from "./tokenbucket";
export class Limiter<T> {
    private algorithim: RateLimitingAlgorithm.TOKEN_BUCKET
    private rateLimiter: RateLimiter<T, number>

    constructor(rateLimiter: RateLimiter<T,number>, max: number, algorithim?: RateLimitingAlgorithm){
        this.algorithim = algorithim ? algorithim: this.algorithim
        this.rateLimiter = rateLimiter
        if (algorithim === RateLimitingAlgorithm.TOKEN_BUCKET){
            //this 
            new TokenBucket(max, rateLimiter)
        }
    }

    
}