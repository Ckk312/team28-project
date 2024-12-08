import type { Request, Response } from 'express';
import { mdbclient } from './mongodb.js';
import { ObjectId, Db } from 'mongodb';

export async function updatedocument(req: Request, res: Response, next: Function) : Promise<void>
{
    // in : collection, _id
    // json body changes depending on collection
    // if Users: email, firstname, lastname
    // if All Teams: username, game, teamaffiliation
    // if MatchInfo: title, game, homescore, awayscore, hometeam, awayteam, date, vod
    // out : error

    const { collection, _id } = { collection: req.body.collection, _id: req.body._id };
    let error : string = '';
    const database: Db = mdbclient.db('LargeProject');
    const id : ObjectId = new ObjectId(`${_id}`);
    if (collection === 'Users')
    {
        try
        { database.collection(collection).updateOne({ _id: id }, { $set: { Login: req.body.email, FirstName: req.body.firstname, LastName: req.body.lastname } }) }
        catch(err: any)
        { error = err.toString() }
    }
    else if (collection === 'All Teams')
    {
        try
        { database.collection(collection).updateOne({ _id: id }, { $set: { Username: req.body.username, Game: req.body.game, IsCaptain: req.body.iscaptain, Role: req.body.role, TeamAffiliation: req.body.teamaffiliation }}) }
        catch(err: any)
        { error = err.toString() }
    }
    else if (collection === 'MatchInfo')
    {
        try
        { database.collection(collection).updateOne({ _id: id }, { $set: { Title: req.body.title, Game: req.body.game, HomeScore: req.body.homescore, AwayScore: req.body.awayscore, HomeTeam: req.body.hometeam, AwayTeam: req.body.awayteam, Date: req.body.date, VOD: req.body.vod }}) }
        catch(err: any)
        { error = err.toString() }
    }

    res.status(200).json({ error: error });
}