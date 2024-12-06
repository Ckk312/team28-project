import type { Request, Response } from 'express';
import type { Db } from 'mongodb';
import { mdbclient } from './mongodb.js';

export async function readdocument(req: Request, res: Response, next: Function) : Promise<void>
{
    // in: collection, name
    // out: _id, error

    const { collection, name } = req.body;
    let error : string = '';
    const database: Db = mdbclient.db('LargeProject');
    let result : any = null;
    if (collection === 'All Teams')
    {
        try
        { result = await database.collection(collection).findOne({ Username: name }) }
        catch(err: any)
        { error = 'No player found' }
    }
    else if (collection === 'MatchInfo')
    {
        try
        { result = await database.collection(collection).findOne({ Title: name }) }
        catch(err: any)
        { error = 'No match found' }
    }
    else if (collection === 'InfiniteGames')
    {
        const list: any = await database.collection('InfiniteGames').findOne();
        result = [list.ApexLegends, list.CallofDuty, list.CounterStrike2, list.LeagueofLegends, list.Overwatch2,
                  list.RainbowSixSiege, list.RocketLeague, list.SmashBros, list.Splatoon, list.Valorant];
    }

    res.status(200).json({ result: result, error: error });
}