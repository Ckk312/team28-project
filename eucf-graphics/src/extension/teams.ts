import * as nodecgApiContext from './nodecg-api-context';
import { TeamInfo, PlayerInfo } from '../types/schemas';

const nodecg = nodecgApiContext.get();
const team : any = nodecg.Replicant<TeamInfo>('teamInfo');

nodecg.listenFor('updateTeamName', (name : string) => {
        team.teamName = name;
});

nodecg.listenFor('updateNumPlayers', (num : number) => {
        team.numOfPlayers = num;
});

nodecg.listenFor('addPlayer', (player : PlayerInfo) => {
        team.players.push(player);
});

nodecg.listenFor('removePlayer', (player : PlayerInfo) => {
        const playerIndex = team.players.indexOf(player);

        if (playerIndex === -1)
            return;
    
        team.players = team.players.filter((element : string, index : number) => { index !== playerIndex });
});