import type { Request, Response } from 'express';
import type { Db } from 'mongodb';
import { mdbclient } from './mongodb.js';

export async function deleteuser(req: Request, res: Response, next: Function) : Promise<void>
{
    // in : email, password, userId
    // out : error

    const { email, password, userId } = req.body;
    let error : string = '';

    const database: Db = mdbclient.db('LargeProject');

    try
    { database.collection('All Players').deleteOne({ Login: email, Password: password, UserID: userId }) }
    catch(err : any)
    {
        error = err.toString();
    }
    

    res.status(200).json({ error: error });
}