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

    async save(item) {
        if (item._id) {
            return await this.updateOne(item._id, item);
        } else {
            return await this.create(item);
        }
    }

    async create(data, orgId) {
        if (orgId) data.organization = orgId;
        
        const created = new this.Schema(data);
        return await created.save();
        // const response = await this.Schema.findOneAndUpdate({}, data, { upsert: true, new: true });
        // console.log('response in BaseModel create:::', response);
        // return response;
    }

    async updateOne(_id, data) {
        const found = await this.Schema.findById(_id);
        Object.assign(found, data);
        return await found.save();
        // const response = await this.Schema.findOneAndUpdate({ _id }, data, { new: true });
        // console.log('response in BaseModel updateOne:::', response);
        // return response;
    }

    async destroy(_id) {
        const found = await this.Schema.findOneAndRemove({ _id });
        if (!found) throw new Error('Item not found.');
        else return found;
    }
}