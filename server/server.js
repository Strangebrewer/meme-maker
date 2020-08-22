import 'dotenv/config';
import express from 'express';
import './connection';
const app = express();
import routes from './routes';
const PORT = process.env.PORT || 3001;
import bodyParser from 'body-parser';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '16mb' }));
app.use(bodyParser.text());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization, Accept");
    res.header("Access-Control-Allow-Methods", "*");
    next();
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

app.use(routes);

app.listen(PORT, () => {
    console.log(`API Server now listening on PORT ${PORT}`);
})