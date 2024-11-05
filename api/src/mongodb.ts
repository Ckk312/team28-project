import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();
const URL : string = process.env.MONGODB_URL!;
export const mdbclient : MongoClient = new MongoClient(URL);