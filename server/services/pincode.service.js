const axios = require('axios');
const { getRedisClient } = require('../config/redis');

const PINCODE_TTL = 86400; // 24 hours

async function lookupPincode(pincode) {
  const redis = getRedisClient();
  const cacheKey = `pincode:${pincode}`;

  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`, { timeout: 5000 });
  const data = response.data;

  if (!data || data[0].Status !== 'Success') {
    return null;
  }

  const postOffices = data[0].PostOffice;
  const result = {
    city: postOffices[0].District,
    district: postOffices[0].District,
    state: postOffices[0].State,
    areas: [...new Set(postOffices.map((p) => p.Name))],
  };

  await redis.set(cacheKey, JSON.stringify(result), 'EX', PINCODE_TTL);
  return result;
}

module.exports = { lookupPincode };
