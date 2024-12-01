import * as nodecgApiContext from './nodecg-api-context';
import { ExampleReplicant } from '../types/schemas/exampleReplicant';
import { TeamInfo, PlayerInfo, CasterInfo, MatchInfo, BreakFlavorText } from '../types/schemas';

const nodecg = nodecgApiContext.get();

nodecg.Replicant<ExampleReplicant>('exampleReplicant', {
        defaultValue: { firstName: "Sophie", lastName: "Tonthat", age: 21 }
});

nodecg.Replicant<TeamInfo>('teamInfo');
nodecg.Replicant<PlayerInfo>('playerInfo');
nodecg.Replicant<CasterInfo>('casterInfo');
nodecg.Replicant<MatchInfo>('matchInfo');
nodecg.Replicant<BreakFlavorText>('breakFlavorText');