import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    image: { type: String, required: true },
    favorite: Boolean,
    largeImage: String,
    midImage: String,
    thumbnail: String,
    publicId: String,
    name: String,
    normalizedName: String,
    organization: { type: Schema.Types.ObjectId, ref: 'Organization' },
}, { timestamps: true });

ImageSchema.pre('save', function (next) {
    this.normalizedName = this.name.toLowerCase();
    next();
});

const Image = mongoose.model('Image', ImageSchema);

export default Image;
