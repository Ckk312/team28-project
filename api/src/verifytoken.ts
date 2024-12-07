import type { Request, Response } from 'express';
import type { Db } from 'mongodb';
import { mdbclient } from './mongodb.js';

export async function verify(req: Request, res: Response, next: Function) : Promise<void> 
{
    // in: token
    // out: error

    const database: Db = mdbclient.db('LargeProject');
    const token = req.params.token;
    const user : any = await database.collection('Users').findOne({TokenExpiry: token}); // retrieve user data

    // Verify the token and update user status
    if(user.TokenExpiry <= Date.now())
    await database.collection('Users').updateOne({TokenExpiry: token}, {$set: {TokenExpiry: -1, Validate: true}});// set verified flag to true

    res.send('Email verified!');
};

