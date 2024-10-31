import express, { Express } from 'express';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

export const app : Express = express();

dotenv.config();
const URL : string = process.env.MONGODB_URL!;
export const mdbclient : MongoClient = new MongoClient(URL);
mdbclient.connect();

app.use(express.json());
app.use((req, res, next) => 
{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
});

app.listen(5000);