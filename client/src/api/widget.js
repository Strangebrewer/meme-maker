import axios from '../plugins/axios';

export default {
    getWeather(zipcode, metric) {
        return axios.get(`external/weather?zipcode=${zipcode}&metric=${metric}`);
    },

    getStock(symbol) {
        return axios.get(`external/stock?symbol=${symbol}`);
    }
}