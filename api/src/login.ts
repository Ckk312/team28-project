import type { Request, Response } from 'express';
import type { Db } from 'mongodb';
import { mdbclient } from './mongodb.js';

export async function login(req: Request, res: Response, next: Function) : Promise<void>
{
    // in : username, password
    // out : UserID, error

    const { username, password } = req.body;

    const database: Db = mdbclient.db('LargeProject');
    const result: any = await database.collection('Users').findOne({ Login: username, Password: password });

    if (!result)
    { res.status(200).json({ _id: -1, error: 'No user found' })}

    res.status(200).json({ firstname: result.FirstName, lastname: result.LastName, _id: result._id, error: '' });
}