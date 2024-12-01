import * as nodecgApiContext from './nodecg-api-context';
import { PlayerInfo } from '../types/schemas';

const nodecg = nodecgApiContext.get();
const player : any = nodecg.Replicant<PlayerInfo>('playerInfo');

nodecg.listenFor('updatePlayerName', (name : string) => {
        player.username = name;
});

nodecg.listenFor('updateRole', (role : string) => {
        player.role = role;
});