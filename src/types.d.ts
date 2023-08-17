 interface RateLimiter<K, V> {
    getValue(key: K): number,
    setValue(key: K, value: V): boolean,
    setTimer?(timeInMillisecond: number, callback: Function): number
}

type TokenBucketError = "Refusing Request"
