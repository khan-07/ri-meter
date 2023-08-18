/**
 * In memory example
 */

export class MyInMemoryStorage implements RateLimiter<string, number>{
    private keyStorage: Record<string, number> = {}

    getValue(key: string): number {
        return this.keyStorage[key]
    }

    setValue(key: string, value: number): boolean {
        this.keyStorage[key] = value
        return true
    }
}