import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { MongoClient, Db } from 'mongodb';

const app : Express = express();

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

app.post('/api/login', async (req : Request, res : Response, next : Function) =>
{
    // in: username, password
    // out: userid, error

    const { username, password } = req.body;
    let error : string = '';
    
    const database : Db = mdbclient.db('LargeProject');
    const result : any = await database.collection('Users').find({ Login: username, Password: password }).toArray();

    let userid : number = -1;
    if (result.length > 0)
    {
        userid = result[0].UserID;
    }

    res.status(200).json({ userid: userid, error: error});
});

app.post('/api/register', async (req : Request, res : Response, next : Function) =>
{
    // in: username, password
    // out: error

    const { username, password } = req.body;

    const newUser : { Login: string, Password: string } = { Login: username, Password: password };
    let error : string = '';

    

    try
    {
        const database : Db = mdbclient.db('LargeProject');
        database.collection('Users').insertOne(newUser);
    }
    catch(e: any)
    {
        error = e.toString();
    }

    res.status(200).json({ error: error });
});

app.listen(5000);