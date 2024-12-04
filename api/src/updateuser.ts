import type { Request, Response } from 'express';
import { mdbclient } from './mongodb.js';
import type { Db } from 'mongodb';

export async function updateuser(req: Request, res: Response, next: Function) : Promise<void>
{
    // in : email, firstname, lastname, userId
    // out : error

    const { email, firstname, lastname, userId } = req.body;
    let error : string = '';

    const database: Db = mdbclient.db('LargeProject');

    try
    {
        database.collection('Users').updateOne({ UserID: userId }, { $set: { Login: email, FirstName: firstname, LastName: lastname } });
    }
    catch(err: any)
    {
        error = err.toString();
    }

    res.status(200).json({ error: error });
}