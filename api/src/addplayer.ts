import type { Request, Response } from 'express';
import type { Db } from 'mongodb';
import { mdbclient } from './mongodb.js';

export async function addplayer(req: Request, res: Response, next: Function) : Promise<void>
{
    // in : username, game, teamaffiliation, userId
    // out : result, error

    const { username, game, teamaffiliation, userId } = req.body;
    let error : string = '';

    const newPlayer: { Username : string, Game: string, TeamAffiliation: string, PlayerID: number, UserID: number } =
                     { Username: username, Game: game, TeamAffiliation: teamaffiliation, PlayerID: Date.now(), UserID: userId };
    const database: Db = mdbclient.db('LargeProject');

    try
    { database.collection('All Players').insertOne(newPlayer) }
    catch(err : any)
    {
        error = err.toString();
    }
    

    res.status(200).json({ error: error });
}