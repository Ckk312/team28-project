import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();
var URL = process.env.MONGODB_URL;
export var mdbclient = new MongoClient(URL);
