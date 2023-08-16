-- Key for the hset of price levels
local hash = KEYS[1]
-- Key for the hset of price levels 'last updated' data
local lastUpdatedHash = KEYS[2]

-- This script retrieves all values from the orderbookLevels and orderbookLevelsLastUpdated caches.
-- The return value is a list of tables:
--   1st -- orderbookLevels
--   2nd -- orderbookLevelsLastUpdateds

return { redis.call("hgetall", hash), redis.call("hgetall", lastUpdatedHash) }
