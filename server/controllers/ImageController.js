import Image from '../models/ImageModel';
import cloudinary from 'cloudinary';
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
});

const imageModel = new Image();

export default {
    async get(req, res) {
        try {
            const images = await imageModel.find({ organization: req.org, ...req.query });
            res.json(images);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async getOne(req, res) {
        try {
            const image = await imageModel.findById(req.params.id);
            res.json(image);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async post(req, res) {
        try {
            const image = await imageModel.create(req.body, req.org);
            res.json(image);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async put(req, res) {
        try {
            const updated = await imageModel.updateOne(req.params.id, req.body);
            res.json(updated);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async destroy(req, res) {
        try {
            const image = await imageModel.destroy(req.params.id);                
            const { result } = await cloudinary.v2.uploader.destroy(image.publicId, { invalidate: true });
            res.json(image);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}