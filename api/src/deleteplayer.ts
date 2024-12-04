import type { Request, Response } from 'express';
import type { Db } from 'mongodb';
import { mdbclient } from './mongodb.js';

export async function deleteplayer(req: Request, res: Response, next: Function) : Promise<void>
{
    // in : username, userId
    // out : error

    const { username, userId } = req.body;
    let error : string = '';

    const database: Db = mdbclient.db('LargeProject');

    try
    { database.collection('All Players').deleteOne({ Username: username, UserID: userId }) }
    catch(err : any)
    {
        error = err.toString();
    }
    

    res.status(200).json({ error: error });
}