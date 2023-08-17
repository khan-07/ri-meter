/**
 * Interface passed should have the following operations. 
 * 1) Get Key
 * 2) Set Key
 * 
 * Each algorithm should have one method called step()
 * which represents a single step in time for this algorithm
 */

/**
 * Token Bucket algorithm works as follows. 
 * 1) Rate limit represented in Request/User/unitTime (3/user/Minutes)
 * 2) Request comes in .   
 *    1) If yes , the token counter is decremented by 1 and request is accepted
 *    2) Set a timer to expire this user after unitTime and set counter to max. 
 *    3) If no, the request is rejected.
 */

export class TokenBucket<T> {
    private max: number;
    private rateLimiter: RateLimiter<T, number>;

    constructor(max: number, rateLimiter: RateLimiter<T, number>) {
        this.max = max;
        this.rateLimiter = rateLimiter
    }

    async step(key: T, callback: Function): Promise<TokenBucketError | true> {
        return new Promise((resolve, reject) => {
            if (this.rateLimiter.getValue(key) >= this.max) {
                //refuse request 
                return reject("Refusing Request")
            } else {
                //accept request
                this.rateLimiter.setValue(key, this.rateLimiter.getValue(key) - 1)
                return resolve(true)
            }
        })
    }
}
