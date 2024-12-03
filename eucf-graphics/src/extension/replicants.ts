import * as nodecgApiContext from './nodecg-api-context';
import { ExampleReplicant } from '../types/schemas/exampleReplicant';
import { EventEmitter } from 'events';
import { TeamInfo, PlayerInfo, CasterInfo, MatchInfo, BreakFlavorText, Scene } from '../types/schemas';

const nodecg = nodecgApiContext.get();
EventEmitter.defaultMaxListeners = 100;

nodecg.Replicant<ExampleReplicant>('exampleReplicant', {
        defaultValue: { firstName: "Sophie", lastName: "Tonthat", age: 21 }
});

nodecg.Replicant<TeamInfo>('teamInfo', {
        defaultValue:
        {
                teamName: "",
                numOfPlayers: 0,
                players: []
        }
});

nodecg.Replicant<PlayerInfo>('playerInfo', {
        defaultValue:
        {
                username: "",
                role: "",
                age: 0,
                major: ""
        }
});

nodecg.Replicant<CasterInfo>('casterInfo', {
        defaultValue:
        {
                username: "",
                pronouns: "",
                handles: {
                        twitter: ""
                }
        }
});

nodecg.Replicant<MatchInfo>('matchInfo', {
        defaultValue:
        {
                gamePlayed: "",
                maps: [],
                teams: [
                        {
                                teamName: "Example Team",
                                players: [
                                        {
                                                username: "Example Playerh"
                                        }
                                ]
                        },
                        {
                                teamName: "Example Team",
                                players: [
                                        {
                                                username: "Example Player"
                                        }
                                ]
                        }
                ],
                score: {
                        teamAScore: 0,
                        teamBScore: 0
                }
        }
});

nodecg.Replicant<BreakFlavorText>('breakFlavorText', {
        defaultValue: "Be right back!"
});
nodecg.Replicant<Scene>('scene', {
        defaultValue: 0
});