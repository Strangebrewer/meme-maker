import Organziation from '../models/OrganizationModel';
const orgModel = new Organziation();

export default {
    async get(req, res) {
        try {
            const orgs = await orgModel.find({});
            res.json(orgs);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async getOne(req, res) {
        try {
            const org = await orgModel.findById(req.params.id);
            res.json(org);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async post(req, res) {
        try {
            const org = await orgModel.save(req.body);
            res.json(org);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async put(req, res) {
        try {
            const updated = await orgModel.save(req.body);
            res.json(updated);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async destroy(req, res) {
        try {
            const org = await orgModel.destroy(req.params.id);                
            res.json(org);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}