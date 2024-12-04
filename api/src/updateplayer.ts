import type { Request, Response } from 'express';
import { mdbclient } from './mongodb.js';
import type { Db } from 'mongodb';

export async function updateplayer(req: Request, res: Response, next: Function) : Promise<void>
{
    // in : username, game, teamaffiliation, playerId, userId
    // out : error

    const { username, game, teamaffiliation, playerId, userId } = req.body;
    let error : string = '';

    const database: Db = mdbclient.db('LargeProject');

    try
    {
        database.collection('Users').updateOne({ PlayerID: playerId, UserID: userId }, { $set: { Username: username, Game: game, TeamAffiliation: teamaffiliation } });
    }
    catch(err: any)
    {
        error = err.toString();
    }

    res.status(200).json({ error: error });
}