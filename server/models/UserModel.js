import bcrypt from 'bcryptjs';
import { sign } from '../passport';
import UserSchema from '../schemas/UserSchema';

export default class User {
    constructor() {
        this.Schema = UserSchema;
    }

    async fetch(userId) {
        const response = await this.Schema.findById(userId, null, { populate: 'organization' });
        if (!response)
            throw new Error('That user does not exist.');

        const { _id, email, firstName, lastName, username, organization } = response;
        const token = sign({ id: _id, username });
        const user = { _id, email, firstName, lastName, username, organization };
        return { token, user };
    }

    async login(reqBody) {
        const { username, password } = reqBody;
        const response = await this.Schema.findOne({ username }, null, { populate: 'organization' });
        if (!response)
            throw new Error('Something went wrong; please try again.');

        const passwordValid = this.checkPassword(password, response.password);
        if (passwordValid) {
            const { _id, email, firstName, lastName, username, organization } = response;
            const token = sign({ id: _id, username });
            const user = { _id, email, firstName, lastName, username, organization };
            return { token, user };
        } else {
            throw new Error('Something went wrong; please try again.');
        }
    }

    async register(reqBody) {
        const { username, email } = reqBody;

        if (!this.validateUsername(username))
            throw new Error('Usernames must be letters and numbers only');

        const user_taken = await this.Schema.findOne({ username });
        if (user_taken)
            throw new Error('That username is already taken.');

        if (email && !this.validateEmail(email))
            throw new Error('You must provide a valid email address.');

        const email_taken = await this.Schema.findOne({ email });
        if (email && email_taken)
            throw new Error('That email has already been used.');

        const password = this.hashPassword(reqBody.password);
        reqBody.password = password;
        const { _id, firstName, lastName } = await this.Schema.create(reqBody);

        const token = sign({ id: _id, username });
        const user = { _id, email, firstName, lastName, username };

        return { token, user };
    }

    async updateUser(reqBody, reqUser) {
        if (reqBody.username && reqBody.username !== reqUser.username) {
            if (!this.validateUsername(reqBody.username))
                throw new Error('Usernames must be letters and numbers only.');

            const user_taken = await this.Schema.findOne({ username: reqBody.username });
            if (user_taken)
                throw new Error('That username is already taken.');
        }

        if (reqBody.email && reqBody.email !== reqUser.email) {
            if (!this.validateEmail(reqBody.email))
                throw new Error('You must provide a valid email address.');

            const email_taken = await this.Schema.findOne({ email: reqBody.email });
            if (reqBody.email && email_taken)
                throw new Error('That email has already been used.');
        }

        const response = await this.Schema.findByIdAndUpdate(reqUser._id, reqBody, { new: true });
        const { _id, username, email, firstName, lastName } = response;
        const user = { _id, username, email, firstName, lastName }

        return user;
    }

    async updatePassword(reqBody, reqUser) {
        const { id, password } = reqUser;
        const { current_password, new_password } = reqBody;
        const passwordValid = this.checkPassword(current_password, password);

        if (passwordValid) {
            const pw = this.hashPassword(new_password);
            const response = await this.Schema.findByIdAndUpdate(id, { password: pw });
            const { _id, username, email, firstName, lastName } = response;
            const user = { _id, username, email, firstName, lastName };
            return user;
        } else {
            throw new Error('Current password is incorrect.');
        }
    }

    validateUsername(username) {
        const test = /^[a-zA-Z0-9]+$/.test(username);
        if (!test) return false;
        return true;
    }

    validateEmail(email) {
        const test = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email);
        if (!test) return false;
        return true;
    }

    checkPassword(inputPassword, password) {
        return bcrypt.compareSync(inputPassword, password);
    }

    hashPassword(plainTextPassword) {
        return bcrypt.hashSync(plainTextPassword, bcrypt.genSaltSync(10), null);
    }
}