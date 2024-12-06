import type { Request, Response } from 'express';
import type { Db } from 'mongodb';
import { mdbclient } from './mongodb.js';

export async function createdocument(req: Request, res: Response, next: Function) : Promise<void>
{
    // in : collection
    // json body changes depending on collection
    // if All Teams: username, game, teamaffiliation
    // if MatchInfo: title, game, homescore, awayscore, hometeam, awayteam, date, vod
    // out : error

    const collection = req.body.collection;
    let error : string = '';
    const database: Db = mdbclient.db('LargeProject');
    if (collection === 'All Teams')
    {
        try
        { database.collection(collection).insertOne({ Username: req.body.username, Game: req.body.game, TeamAffiliation: req.body.teamaffiliation }) }
        catch(err: any)
        { error = err.toString() }
    }
    else if (collection === 'MatchInfo')
    {
        try
        { database.collection(collection).insertOne({ Title: req.body.title, Game: req.body.game, HomeScore: req.body.homescore, AwayScore: req.body.awayscore, HomeTeam: req.body.hometeam, AwayTeam: req.body.awayteam, Date: req.body.date, VOD: req.body.vod }) }
        catch(err: any)
        { error = err.toString() }
    }

    res.status(200).json({ error: error });
}