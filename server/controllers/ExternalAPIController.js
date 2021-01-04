import https from 'https';
import Cache from '../models/CacheModel';

export default {
    async getWeather(req, res) {
        const { zipcode, metric } = req.query;

        const type = metric === 'true' ? 'C' : 'F';
        const cacheKey = `weather_${type}_${zipcode}`;
        let weatherData = await Cache.getKey(cacheKey);

        if (weatherData === null) {
            const WEATHER_API_KEY = process.env.HERE_API_KEY;
            const WEATHER_API_URL = 'https://weather.ls.hereapi.com/weather/1.0/report.json';
            const url = `${WEATHER_API_URL}?apiKey=${WEATHER_API_KEY}&zipcode=${zipcode}&metric=${metric}&product=forecast_7days_simple`;

            https.get(url, response => {
                let body = '';
                response.on('data', data => body += data);
                response.on('end', () => {
                    Cache.setKey(cacheKey, body, 3600);
                    res.json(JSON.parse(body))
                });
            });
        } else {
            res.json(JSON.parse(weatherData));
        }
    },

    async getStock(req, res) {
        const cacheKey = `stocks_${req.query.symbol.toUpperCase()}`;
        let stockData = await Cache.getKey(cacheKey);

        if (stockData === null) {
            const IEX_CLOUD_TOKEN = process.env.IEX_CLOUD_API_KEY;
            const url = `https://cloud.iexapis.com/stable/stock/${req.query.symbol}/quote?token=${IEX_CLOUD_TOKEN}`;

            https.get(url, response => {
                let body = '';
                response.on('data', data => body += data);
                response.on('end', () => {
                    Cache.setKey(cacheKey, body, 3600);
                    res.json(JSON.parse(body))
                });
            });
        } else {
            res.json(JSON.parse(stockData));
        }
    }
}