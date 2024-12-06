import type { Request, Response } from 'express';
import { Db, ObjectId } from 'mongodb';
import { mdbclient } from './mongodb.js';

export async function deletedocument(req: Request, res: Response, next: Function) : Promise<void>
{
    // in : collection, _id
    // out : error

    const { collection, _id } = req.body;
    let error : string = '';

    const database: Db = mdbclient.db('LargeProject');

    const id : ObjectId = new ObjectId(`${_id}`);
    try
    { database.collection(collection).deleteOne({ _id: id }) }
    catch(err : any)
    { error = err.toString() }
    

    res.status(200).json({ error: error });
}