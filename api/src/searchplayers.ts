import type { Request, Response } from 'express';
import type { Db } from 'mongodb';
import { mdbclient } from './mongodb.js';

export async function searchplayers(req: Request, res: Response, next: Function) : Promise<void>
{
    // in : query, userId
    // out : result, error

    const { query, userId } = req.body;
    let error : string = '';

    const database: Db = mdbclient.db('LargeProject');
    const result: any = await database.collection('All Teams').find({ TeamAffiliation: query, Username: query, Game: query, UserID: userId }).toArray();

    res.status(200).json({ result: result, error: error });
}