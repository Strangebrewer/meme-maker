import BaseAPI from './baseApi';
import axios from '../plugins/axios';

class ContentAPI extends BaseAPI {
    constructor() {
        super('content');
    }

    getCalendar(url) {
        return axios.get(`content/calendar?url=${url}`);
    }
}

export default new ContentAPI();
