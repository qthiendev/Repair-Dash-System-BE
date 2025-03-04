const redis = require('redis');
require('dotenv').config();

const client = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
    },
    password: process.env.REDIS_PASSWORD,
});

client.connect().catch(console.error);

client.on('error', (err) => console.error('Redis Client Error', err));

module.exports = client;
