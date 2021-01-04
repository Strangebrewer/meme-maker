import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CacheSchema = new Schema({
    name: String,
    data: String,
    // ttl is the number of seconds the data is good
    ttl: Number,
    // unix timestamp when the data was cached
    created: Number
});

export default mongoose.model('Cache', CacheSchema);
