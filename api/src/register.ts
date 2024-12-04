import type { Request, Response } from 'express';
import type { Db } from 'mongodb';
import { mdbclient } from './mongodb.js';
import crypto from 'crypto';
import { sendMail } from './util/mailer.js';

export async function register (req : Request, res : Response, next : Function) : Promise<void>
{
    // in: email, password, first name, last name
    // out: error
    
    const { email, password, firstname, lastname } = req.body;
    
    const newUser : { Login: string, Password: string, FirstName: string, LastName: string, ResetToken: string, TokenExpiry: number, UserID: number, Validate: boolean } = 
                    { Login: email, Password: password, FirstName: firstname, LastName: lastname, ResetToken: '', TokenExpiry: Date.now(), UserID: Date.now(), Validate: false};
    let error : string = '';
    
    try
    {
        const database : Db = mdbclient.db('LargeProject');
        database.collection('Users').insertOne(newUser);

        const url : string = `http://ckk312.xyz:5000/verifytoken/${newUser.TokenExpiry}`;

        await sendMail(email, `Email Verification`, `Click the link to verify your email: ${url}`);

        res.status(200).json('Email sent with details to verify your email');
    }
    catch(err : any)
    {
        error = err.toString();
    }
    
    res.status(200).json({ error: error });
}