async function test() {
  const Redis = require("ioredis");
  const redis = new Redis();
  const keys = await redis.keys("*");
  console.log(keys);
}
test();
