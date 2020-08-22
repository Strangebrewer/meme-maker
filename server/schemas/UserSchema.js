import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const Schema = mongoose.Schema;

const tempPw = bcrypt.hashSync('1234', bcrypt.genSaltSync(10), null);

const UserSchema = new Schema({
    username: { type: String, reruired: true },
    password: { type: String, required: true, default: tempPw },
    organization: { type: Schema.Types.ObjectId, ref: 'Organization' },
    email: String,
    firstName: String,
    lastName: String
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

export default User;
