import CacheSchema from '../schemas/CacheSchema';

export default {
    async getKey(cacheKey) {
        const data = await CacheSchema.findOne({ name: cacheKey });
        if (data) {
            const stale = (new Date() - data.created) > (data.ttl * 1000);
            if (stale) {
                await this.deleteKey(cacheKey);
                return null;
            }
            return data.data;
        }
        return null;
    },

    async setKey(cacheKey, data, ttl) {
        const found = await CacheSchema.findOne({ name: cacheKey });
        if (found) {
            await CacheSchema.deleteOne({ name: cacheKey });
        }

        const created = new Date(); // convert this to unix timestamp (seconds, not milliseconds)
        const newData = await CacheSchema.create({ name: cacheKey, data, created, ttl });
        return newData;
    },

    async deleteKey(cacheKey) {
        const found = await CacheSchema.findOne({ name: cacheKey });
        if (found) {
            await CacheSchema.deleteOne({ name: cacheKey });
            return 'success';
        }
    }
}