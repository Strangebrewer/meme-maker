import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const RenderSchema = new Schema({
    html: String,
    name: String,
    slug: String,
    content: { type: Schema.Types.ObjectId, ref: 'Content' }
}, { timestamps: true });

RenderSchema.pre('save', function (next) {
    this.normalizedName = this.name.toLowerCase();
    next();
})

const Render = mongoose.model('Render', RenderSchema);

export default Render;
