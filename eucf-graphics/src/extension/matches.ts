import * as nodecgApiContext from './nodecg-api-context';
import { MatchInfo, TeamInfo } from '../types/schemas';

const nodecg = nodecgApiContext.get();
const match : any = nodecg.Replicant<MatchInfo>('matchInfo');

nodecg.listenFor('updateGame', (game : string) => {
        match.gamePlayed = game;
});

nodecg.listenFor('addMap', (map : string) => {
        match.maps.push(map);
});

nodecg.listenFor('removeMap', (map : string) => {
        const mapIndex = match.maps.indexOf(map);

        if (mapIndex === -1)
            return;
        
        match.maps = match.maps.filter((element : string, index : number) => { index !== mapIndex });
});

nodecg.listenFor('updateScore', (newScore : object) => {
        match.score = newScore;
});

nodecg.listenFor('updateMatchTeamA', (team : TeamInfo) => {
        match.teams.teamA = team;
});

nodecg.listenFor('updateMatchTeamB', (team : TeamInfo) => {
        match.teams.teamB = team;
});