import BaseAPI from './baseApi';
import axios from '../plugins/axios';

class ContentAPI extends BaseAPI {
    constructor() {
        super('content');
    }

    getCalendar(url) {
        return axios.get(`content/calendar?url=${url}`);
    }

    getRender(slug) {
        return axios.get(`content/render/${slug}`);
    }
}

export default new ContentAPI();
