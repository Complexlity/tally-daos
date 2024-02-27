import Redis from 'ioredis'

const redisUrl = process.env.REDIS_CLIENT_URL
if(!redisUrl) throw new Error("Redis Client URL missing from .env")
const redisKv = new Redis(redisUrl);


export { redisKv }