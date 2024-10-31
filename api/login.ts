import { mdbclient } from './app.ts';
import type { Express, Request, Response } from 'express';
import type { Db } from 'mongodb';

module.exports = function( app: Express ) : void
{
    app.post('/api/login', async (req : Request, res : Response, next : Function) =>
    {
        // in: username, password
        // out: userid, error
    
        const { username, password } = req.body;
        let error : string = '';
        
        const database : Db = mdbclient.db('LargeProject');
        const result : any = await database.collection('Users').find({ Username: username, Password: password }).toArray();
    
        let userid : number = result[0].userid | -1;
    
        res.status(200).json({ userid: userid, error: error});
    });
}