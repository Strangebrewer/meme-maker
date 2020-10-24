import SVG from '../models/SVGModel';
const svgModel = new SVG();

export default {
    async get(req, res) {
        try {
            const images = await svgModel.find({ organization: req.org, ...req.query });
            res.json(images);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async getOne(req, res) {
        try {
            const image = await svgModel.findById(req.params.id);
            res.json(image);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async post(req, res) {
        try {
            const image = await svgModel.create(req.body, req.org);
            res.json(image);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async put(req, res) {
        try {
            const updated = await svgModel.updateOne(req.params.id, req.body);
            res.json(updated);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async destroy(req, res) {
        try {
            const image = await svgModel.destroy(req.params.id);                
            res.json(image);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}