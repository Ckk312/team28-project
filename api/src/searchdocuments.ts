import type { Request, Response } from 'express';
import type { Db } from 'mongodb';
import { mdbclient } from './mongodb.js';
import Fuse from 'fuse.js';

export async function searchdocuments(req: Request, res: Response, next: Function) : Promise<void>
{
    // in : collection, query
    // out : result, error

    const { collection, query, searchKeys } = req.body;
    let error : string = '';

    const database: Db = mdbclient.db('LargeProject');
    
    let search = null;
    if(collection === 'All Teams')
    {
        const list: any = await database.collection('All Teams').find().toArray();
        const keys = { keys: searchKeys || ["Game"] };
        const fuse = new Fuse(list, keys);
        search = fuse.search(query);
    }
    else if(collection === 'MatchInfo')
    {
        const list: any = await database.collection('MatchInfo').find().toArray();
        const keys = { keys: searchKeys || ["Game"] };
        const fuse = new Fuse(list, keys);
        search = fuse.search(query);
    }

    const result = search?.map((obj : Object, i) => {
        obj = search[i].item as Object
        return obj;
    })

    res.status(200).json({ result: result, error: error });
}