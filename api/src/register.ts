import type { Request, Response } from 'express';
import type { Db } from 'mongodb';
import { mdbclient } from './mongodb.js';

export async function register (req : Request, res : Response, next : Function) : Promise<void>
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
    catch(err : any)
    {
        error = err.toString();
    }
    
    res.status(200).json({ error: error });
}