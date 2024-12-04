import * as nodecgApiContext from './nodecg-api-context';
import { MatchInfo, PlayerInfo, TeamInfo } from '../types/schemas';

const nodecg = nodecgApiContext.get();
const match = nodecg.Replicant<MatchInfo>('matchInfo');

nodecg.listenFor('updateGame', (game : string) => {
        match!.value!.gamePlayed = game;
});

nodecg.listenFor('addMap', (map : string) => {
        match!.value!.maps!.push(map);
});

nodecg.listenFor('removeMap', (map : string) => {
        const mapIndex = match?.value?.maps?.indexOf(map);

        if (mapIndex === -1 || mapIndex === undefined)
            return;
        
        match!.value!.maps = match!.value!.maps!.filter((element : string, index : number) => { index !== mapIndex });
});

nodecg.listenFor('updateScore', (newScore : { teamAScore: number, teamBScore: number, [k: string]: unknown }) => {
        match!.value!.score = newScore;
});

nodecg.listenFor('updateMatchTeamA', (team : TeamInfo) => {
        match!.value!.teams[0] = team;
});

nodecg.listenFor('updateMatchTeamB', (team : TeamInfo) => {
        match!.value!.teams[1] = team;
});

nodecg.listenFor('updateTeamPlayers', (info: { players: PlayerInfo[], type: number }) => {
        if (info.type != 0 && info.type != 1) {
                return;
        }

        const newMatch: MatchInfo = {...(match.value!)};
        newMatch.teams[info.type].players = info.players;

        match!.value = newMatch;
});