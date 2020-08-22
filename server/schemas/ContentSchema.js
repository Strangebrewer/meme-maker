import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ContentSchema = new Schema({
    backgroundColor: { type: String, default: '#fff' },
    height: Number,
    width: Number,
    name: String,
    normalizedName: String,
    objects: [{}],
    organization: { type: Schema.Types.ObjectId, ref: 'Organization' },
}, { timestamps: true });

ContentSchema.pre('save', function (next) {
    this.normalizedName = this.name.toLowerCase();
    next();
})

const Content = mongoose.model('Content', ContentSchema);

export default Content;