import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const OrganizationSchema = new Schema({
   name: String,
   normalizedName: String,
   users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

OrganizationSchema.pre('save', function (next) {
    this.normalizedName = this.name.toLowerCase();
    next();
});

const Organization = mongoose.model('Organization', OrganizationSchema);

export default Organization;
