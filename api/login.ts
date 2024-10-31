import { app, mdbclient } from './app.ts';
import type { Request, Response } from 'express';
import type { Db } from 'mongodb';

app.post('/api/login', async (req : Request, res : Response, next : Function) =>
{
    // in: username, password
    // out: userid, error

    const { username, password } = req.body;
    let error : string = '';
    
    const database : Db = mdbclient.db('n/a');
    const result : any = await database.collection('n/a').find({ Username: username, Password: password }).toArray();

    let userid : number = result[0].userid|-1;

    res.status(200).json({ userid: userid, error: error});
})