import BaseAPI from './baseApi';
import axios from '../plugins/axios';

class ImageAPI extends BaseAPI {
    constructor() {
        super('image');
    }
}

export default new ImageAPI();
