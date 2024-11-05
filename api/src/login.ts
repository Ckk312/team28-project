import type { Request, Response } from 'express';
import type { Db } from 'mongodb';
import { mdbclient } from './mongodb.js';

export async function login(req: Request, res: Response, next: Function) : Promise<void>
{
    // in : Username, Password
    // out : UserID, error

    const { username, password } = req.body;
    let error : string = '';

    const database: Db = mdbclient.db('LargeProject');
    const result: any = await database.collection('Users').find({ Login: username, Password: password }).toArray();

    let userId: number = -1;
    if (result[0])
    {
        userId = result[0].UserID;
    } else 
    {
        error = 'No user found.';
    }

    res.status(200).json({ userId: userId, error: error });
}