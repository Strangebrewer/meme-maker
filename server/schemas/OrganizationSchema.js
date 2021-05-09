import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import slugify from 'slugify';

const OrganizationSchema = new Schema({
   name: String,
   normalizedName: String,
   slug: String,
   users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

OrganizationSchema.pre('save', function (next) {
    this.normalizedName = this.name.toLowerCase();
    this.slug = slugify(this.name, { lower: true });
    next();
});

const Organization = mongoose.model('Organization', OrganizationSchema);

export default Organization;
