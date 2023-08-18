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
    private rateLimiter: TokenBucket<T>
    private storage: RateLimiter<T, number>
    //Change the following to support multiple keys
    private key: string;

    constructor(rateLimiter: RateLimiter<T,number>, max: number, algorithim?: RateLimitingAlgorithm){
        this.algorithim = algorithim ? algorithim: this.algorithim
        this.storage = rateLimiter
        if (algorithim === RateLimitingAlgorithm.TOKEN_BUCKET){
            //this 
            this.rateLimiter = new TokenBucket(max, this.storage)
        }
    }

    //for now implementation assumes express but we can handle this later
    public async handle(req: any, res:any, next: Function){
        await this.rateLimiter.step(req[this.key])
    }
    
}