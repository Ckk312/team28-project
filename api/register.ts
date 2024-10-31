import { app, mdbclient } from './app.ts';
import type { Request, Response } from 'express';
import type { Db } from 'mongodb';

app.post('/api/register', async (req : Request, res : Response, next : Function) =>
{
    // in: username, password
    // out: error

    console.log("hello gang");
    
    const { username, password } = req.body;
    
    const newUser : { Username: string, Password: string } = { Username: username, Password: password };
    let error : string = '';
    
    try
    {
        const database : Db = mdbclient.db('LargeProject');
        database.collection('Users').insertOne(newUser);
    }
    catch(err)
    {
        error = err.toString();
    }
    
    res.status(200).json({ error: error });
});