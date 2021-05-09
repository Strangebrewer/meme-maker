import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import slugify from 'slugify';

const ContentSchema = new Schema({
    backgroundColor: { type: String, default: '#fff' },
    backgroundImage: String,
    height: Number,
    width: Number,
    thumbnail: String,
    name: String,
    slug: String,
    normalizedName: String,
    objects: [{}],
    render: { type: Schema.Types.ObjectId, ref: 'Render' },
    url: String,
    organization: { type: Schema.Types.ObjectId, ref: 'Organization' },
}, { timestamps: true });

ContentSchema.pre('save', function (next) {
    this.normalizedName = this.name.toLowerCase();
    this.slug = slugify(this.name, { lower: true });
    next();
});

const Content = mongoose.model('Content', ContentSchema);

export default Content;
