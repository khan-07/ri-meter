//This file contains example usage for the limiter class which
//will be the interface to the rest of the project 

import { Limiter } from "./limiter"

/**
 * In memory example
 */

class MyInMemoryStorage implements RateLimiter<string, number>{
    private keyStorage: Record<string, number> = {}

    getValue(key: string): number {
        return this.keyStorage[key]
    }

    setValue(key: string, value: number): boolean {
        this.keyStorage[key] = value
        return true
    }
}

const app = {
    use:(route: string, ..._callback: Function[])=>{}
}
//Assuming it's a express server than we can use it like that
/**
 * const inMemoryRateLimiter = new limiter()
 * app.use("/", )
 * 
 */

const inMemoryStorage = new MyInMemoryStorage()
const inMemoryRateLimiter = new Limiter(inMemoryStorage, 10)
app.use("/",inMemoryRateLimiter.handle)