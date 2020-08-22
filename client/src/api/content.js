import BaseAPI from './baseApi';

class ContentAPI extends BaseAPI {
    constructor() {
        super('content');
    }
}

export default new ContentAPI();
