import type { Request, Response } from 'express';
import type { Db } from 'mongodb';
import { mdbclient } from './mongodb.js';
import crypto from 'crypto';
import { sendMail } from './util/mailer.js';

export async function forgotpass(req: Request, res: Response, next: Function) : Promise<void>
{
    // in : email
    // out : error

    const { email } = req.body;
    let error : string = '';

    const database: Db = mdbclient.db('LargeProject');
    const result: any = await database.collection('Users').find({ Login: email }).toArray();

    if (result[0])
    {
        const token = crypto.randomBytes(20).toString('hex');
        result[0].ResetToken = token;
        result[0].TokenExpiry = Date.now() + 3600000;

        const url : string = `http://localhost:5000/resetpass/${token}`;

        await sendMail(email, 'Password Reset', `Click the link to reset your password: ${url}`);

        res.status(200).json('Email sent with details to reset your password');
    } else 
    {
        error = 'Bad request';
    }

    res.status(200).json({ error: error });
}