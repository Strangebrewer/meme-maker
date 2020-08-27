import Content from '../models/ContentModel';
const contentModel = new Content();
import ical from 'ical';

import https from 'https';

export default {
    async getCalendar(req, res) {
        https.get(req.query.url, response => {
            let body = '';
            response.on('data', data => body += data);

            response.on('end', () => {
                body = ical.parseICS(body);
                // other filtering and formatting can happen here
                res.json(body);
            });
        })
    },

    async get(req, res) {
        try {
            const items = await contentModel.find({ organization: req.org });
            res.json(items);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async getOne(req, res) {
        try {
            const item = await contentModel.findById(req.params.id);
            res.json(item);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async post(req, res) {
        try {
            const item = await contentModel.create(req.body, req.user._id, req.org);
            res.json(item);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async put(req, res) {
        try {
            const updated = await contentModel.updateOne(req.params.id, req.body);
            res.json(updated);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async destroy(req, res) {
        try {
            const removed = await contentModel.delete(req.params.id);
            res.json(removed);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}