import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const SVGSchema = new Schema({
    svg: { type: String, required: true },
    favorite: Boolean,
    name: String,
    normalizedName: String,
    organization: { type: Schema.Types.ObjectId, ref: 'Organization' },
}, { timestamps: true });

SVGSchema.pre('save', function (next) {
    this.normalizedName = this.name.toLowerCase();
    next();
});

export default mongoose.model('SVG', SVGSchema);
