import slugify from 'slugify';

export default class BaseModel {
    constructor(model) {
        this.Schema = model;
    }

    async findById(id, fields = null, options = {}) {
        const found = await this.Schema.findById(id, fields, options);
        return found;
    }

    async find(query = {}, fields = null, options = {}) {
        const defaultOptions = {
            sort: {},
            limit: 20,
            skip: 0,
            populate: null
        };

        options = Object.assign(defaultOptions, options);
        const found = await this.Schema.find(query, fields, options);
        return found;
    }

    async findOne(query = {}, fields = null, options = {}) {
        return await this.Schema.findOne(query, fields, options);
    }

    async getCount() {
        const count = await this.Schema.countDocuments();
        return count;
    }

    async create(data, orgId) {
        if (orgId) data.organization = orgId;
        data.slug = slugify(data.name, { lower: true });

        const created = await this.Schema.create(data);
        return created;
    }

    async updateOne(_id, data, options) {
        options = { ...options, new: true };
        if (data.name) data.slug = slugify(data.name, { lower: true });
        const updated = await this.Schema.findOneAndUpdate({ _id }, data, options);
        return updated;
    }

    async destroy(_id) {
        const found = await this.Schema.findOneAndRemove({ _id });
        if (!found) throw new Error('Item not found.');
        else return found;
    }
}