import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import slugify from 'slugify';

const RenderSchema = new Schema({
    html: String,
    name: String,
    normalizedName: String,
    slug: String,
    content: { type: Schema.Types.ObjectId, ref: 'Content' }
}, { timestamps: true });

RenderSchema.pre('save', function (next) {
    this.normalizedName = this.name.toLowerCase();
    this.slug = slugify(this.name, { lower: true });
    next();
})

const Render = mongoose.model('Render', RenderSchema);

export default Render;
