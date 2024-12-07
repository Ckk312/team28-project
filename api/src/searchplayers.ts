import type { Request, Response } from 'express';
import type { Db } from 'mongodb';
import { mdbclient } from './mongodb.js';
import Fuse from 'fuse.js';

export async function searchplayers(req: Request, res: Response, next: Function) : Promise<void>
{
    // in : query, userId
    // out : result, error

    const { query, userId } = req.body;
    let error : string = '';

    const database: Db = mdbclient.db('LargeProject');
    const list: any = await database.collection('All Teams').find().toArray();
    if(!query)
    {
        res.status(200).json({ result: list, error: error });
        return;
    }
    
    const keys = { keys: ["TeamAffiliation", "Username", "Game"] };
    const fuse = new Fuse(list, keys);
    const result = fuse.search(query);

    res.status(200).json({ result: result, error: error });
}