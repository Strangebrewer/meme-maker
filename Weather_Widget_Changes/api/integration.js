import axios from '../plugins/axios';

const endpoint = 'integrations';

export default {
    stock: (data) => axios.get(`${endpoint}/stock?symbol=${data}`),
    weather: data => axios.get(`${endpoint}/weather?zipcode=${data.zipcode}&metric=${data.metric}`),
};
