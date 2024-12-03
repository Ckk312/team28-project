import type { Request, Response } from 'express';
import type { Db } from 'mongodb';
import { mdbclient } from './mongodb.js';
import crypto from 'crypto';
import { sendMail } from './util/mailer.js';

export async function verifyemail(req: Request, res: Response, next: Function) : Promise<void>
{
    // in : email, token
    // out : error

    const { email, token } = req.body;
    let error : string = '';

    const database: Db = mdbclient.db('LargeProject');
    let result1 : any = await database.collection('Users').findOne({ Login: email });
    let result2 : any = await database.collection('Users').findOne({ Login: email, ResetToken: token});

    if ((result1 && result2) && token)
    {   
        if (Date.now() < result1.TokenExpiry)
        {
            database.collection('Users').updateOne( { Login: email }, { $set: { EmailVerified: true, ResetToken: "" } });
            error = 'Email verified'
        }
        else
        {
            error = 'Email expired'
        }
    }
    else if (result1 && !result2)
    {
        const newToken = crypto.randomBytes(20).toString('hex');
        const tokenExpiration = Date.now() + 3600000;
        database.collection('Users').updateOne({ Login: email }, { $set: { ResetToken: newToken, TokenExpiry: tokenExpiration } });

        const url : string = `http://ckk312.xyz:5000/verifyemail?${newToken}`;

        await sendMail(email, 'Email Verification', `Click the link to verify your email: ${url}`);

        error = 'Email has been sent';
    } else 
    {
        error = 'Bad request';
    }

    res.status(200).json({ error: error });
}