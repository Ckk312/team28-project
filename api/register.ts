import { app, mdbclient } from './app.ts';
import type { Request, Response } from 'express';
import type { Db } from 'mongodb';

app.post('/api/register', async (req : Request, res : Response, next : Function) =>
{
    // in: username, password
    // out: error
    
    const { username, password } = req.body;
    
    const newUser : { Username: string, Password: string } = { Username: username, Password: password };
    let error : string = '';
    
    try
    {
        const database : Db = mdbclient.db('n/a');
        database.collection('n/a').insertOne(newUser);
    }
    catch(err)
    {
        error = err.toString();
    }
    
    res.status(200).json({ error: error });
});