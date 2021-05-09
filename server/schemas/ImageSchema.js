import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import slugify from 'slugify';

const ImageSchema = new Schema({
    image: { type: String, required: true },
    favorite: Boolean,
    largeImage: String,
    midImage: String,
    thumbnail: String,
    publicId: String,
    name: String,
    normalizedName: String,
    slug: String,
    normalizedName: String,
    organization: { type: Schema.Types.ObjectId, ref: 'Organization' },
}, { timestamps: true });

ImageSchema.pre('save', function (next) {
    this.normalizedName = this.name.toLowerCase();
    this.slug = slugify(this.name, { lower: true });
    next();
});

const Image = mongoose.model('Image', ImageSchema);

export default Image;
