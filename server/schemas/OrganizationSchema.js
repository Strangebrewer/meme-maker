import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const OrganizationSchema = new Schema({
   name: String,
   users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

const Organization = mongoose.model('Organization', OrganizationSchema);

export default Organization;
