import mongoose from 'mongoose';

const { DB_USERNAME, DB_PASSWORD, DB_CLUSTER, DB_NAME, MONGODB_URI } = process.env;

const uri = MONGODB_URI || `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_CLUSTER}.mongodb.net/${DB_NAME}?retryWrites=true`;

mongoose.connect(uri, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true })
   .then(() => console.log('Connected to Mongo'))
   .catch(err => console.log('Error connecting to Mongo: ', err));

export default mongoose.connection;
