import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import slugify from 'slugify';

const SVGSchema = new Schema({
    svg: { type: String, required: true },
    favorite: Boolean,
    name: String,
    normalizedName: String,
    slug: String,
    organization: { type: Schema.Types.ObjectId, ref: 'Organization' },
}, { timestamps: true });

SVGSchema.pre('save', function (next) {
    this.normalizedName = this.name.toLowerCase();
    this.slug = slugify(this.name, { lower: true });
    next();
});

export default mongoose.model('SVG', SVGSchema);
