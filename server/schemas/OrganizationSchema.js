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
    console.log('running the pre-save function');
    this.normalizedName = this.name.toLowerCase();
    console.log('this.modifiedPaths():::', this.modifiedPaths());
    this.slug = slugify(this.name, { lower: true });
    next();
});

OrganizationSchema.post('save', function (doc, next) {
    console.log('this.name in Org Schema post-updateOne:::', this.name);
    console.log('this.modifiedPaths():::', this.modifiedPaths());
    console.log('doc in Org Schema post-updateOne:::', doc);
    next();
});

OrganizationSchema.pre('findOneAndUpdate', function (argOne, argTwo) {
    console.log('this.name in Org Schema PRE-findOneAndUpdate:::', this.name);
    console.log('argTwo in Org Schema PRE-findOneAndUpdate:::', argTwo);
    console.log('argOne in Org Schema PRE-findOneAndUpdate:::', argOne);
    argOne();
});

OrganizationSchema.post('findOneAndUpdate', function (argOne, argTwo) {
    console.log('this.name in Org Schema POST-findOneAndUpdate:::', this.name);
    console.log('argOne.modifiedPaths() in Org Schema POST-findOneAndUpdate:::', argOne.modifiedPaths());
    console.log('argOne in Org Schema POST-findOneAndUpdate:::', argOne);
    argTwo();
});

const Organization = mongoose.model('Organization', OrganizationSchema);

export default Organization;
