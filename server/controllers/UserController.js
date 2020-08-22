import User from '../models/UserModel';
import Org from '../models/OrganizationModel'

const userModel = new User();
const orgModel = new Org();

export default {
    async getCurrentUser(req, res) {
        try {
            const response = await userModel.fetch(req.user._id);
            res.json(response);
        } catch (error) {
            console.log('error in UserController.getCurrentUser catch block:::', error);
            res.status(404).send({
                error: error.message
            });
        }
    },

    async register(req, res) {
        console.log('signing up');
        try {
            const body = { ...req.body };
            delete body.organization;
            const { user, token } = await userModel.register(body);
    
            const org = await orgModel.create({ name: req.body.organization }, user._id);
            const userWithOrg = await userModel.updateUser({ organization: org._id }, user);
    
            res.json({ user: userWithOrg, token });
        } catch (error) {
            console.log('e in UserController.register catch block:::', error);
            res.status(400).send({
                error: error.message
            });
        }
    },

    async login(req, res) {
        try {
            const response = await userModel.login(req.body);
            res.json(response);
        } catch (error) {
            console.log('e in UserController.login catch block:::', error);
            res.status(401).send({
                error: error.message
            });
        }
    },

    async put(req, res) {
        try {
            const user = await userModel.updateUser(req.body, req.user);
            res.json(user);
        } catch (error) {
            console.log('e in UserController.put catch block:::', error);
            res.status(400).send({
                error: error.message
            });
        }
    },

    async updatePassword(req, res) {
        try {
            const user = await userModel.updatePassword(req.body, req.user);
            res.json(user);
        } catch (error) {
            console.log('e in UserController.updatePassword catch block:::', error);
            res.status(400).send({
                error: error.message
            });
        }
    },

    async destroy(req, res) {
        try {
            const user = await userModel.Schema.findByIdAndDelete(req.params.id);
            res.json(user);
        } catch (error) {
            console.log('e in UserController.remove catch block:::', error);
            res.status(400).send({
                error: error.message
            });
        }
    }
}