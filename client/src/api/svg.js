import BaseAPI from './baseApi';
import axios from '../plugins/axios';

class SvgAPI extends BaseAPI {
    constructor() {
        super('svg');
    }
}

export default new SvgAPI();
