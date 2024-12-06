import type { Request, Response } from 'express';
import type { Db } from 'mongodb';
import { mdbclient } from './mongodb.js';

export async function register (req : Request, res : Response, next : Function) : Promise<void>
{
    // in: email, password, first name, last name
    // out: error
    
    const { email, password, firstname, lastname } = req.body;
    
    const newUser : { Login: string, EmailVerified: boolean, Password: string, FirstName: string, LastName: string, ResetToken: string, TokenExpiry: number } = 
                    { Login: email, EmailVerified: false, Password: password, FirstName: firstname, LastName: lastname, ResetToken: '', TokenExpiry: Date.now() };
    let error : string = '';
    
    try
    {
        const database : Db = mdbclient.db('LargeProject');
        database.collection('Users').insertOne(newUser);
    }
    catch(err : any)
    {
        error = err.toString();
    }
    
    res.status(200).json({ error: error });
}