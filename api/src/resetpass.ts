import type { Request, Response } from 'express';
import type { Db } from 'mongodb';
import { mdbclient } from './mongodb.js';

export async function resetpass(req : Request, res : Response, next : Function) : Promise<void>
{
    // in: password, token
    // out: error

    const { password, token } = req.body;
    let error : string = '';

    const database : Db = mdbclient.db('LargeProject');
    const result : any = await database.collection('Users').findOne({ ResetToken: token });

    if(result === null )
    {
        error = 'Cannot find user';
        res.status(200).json({ error: error });
        return;
    }
    else if(result.TokenExpiry <= Date.now())
    {
        error = 'Session expired';
        res.status(200).json({ error: error });
        return;
    }

    database.collection('Users').updateOne({ ResetToken: token }, { $set: { Password: password, ResetToken: "" } });

    res.status(200).json({ error: error });
}