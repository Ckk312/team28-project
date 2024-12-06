import { useState } from "react";

import './TeamLayout.css';

async function getRoster(title: string): Promise<any> {
    const header = new Headers();
    header.append('Content-type', 'application/json')

    return await fetch('https://www.ckk312.xyz/api/searchdocuments', {
        method: 'POST',
        body: JSON.stringify({ collection: 'All Teams' , query: title }),
        headers: header
    });
}

/***
 * Team Layout React Component
 * 
 */
export default function TeamLayout() {
    const [roster, setRoster] = useState<any[]>([]);

    let path = window.location.pathname;
    const game = path.split('/');
    console.log(game);

    const allRosters = ['Knights', 'Knights Academy', 'Knights Rising', 'Knights Pink']
    let rosterNum = 2;

    console.log('game[-1]: ' + game.at(-1));

    if (game.at(-1) === 'Valorant') {
        rosterNum = 0;
    }

    else if (game.at(-1) === 'Splatoon') {
        rosterNum = 1;
    }

    else if (game.at(-1) === 'SmashUltimate') {
        rosterNum = 3;
    }

    const rosters = allRosters.slice(rosterNum);

    const handleLoad = async () => {
        const stuff = await getRoster(game.at(-1)!);
        console.log(stuff);
        setRoster(stuff.result);
    }

    console.log(roster);

    return (
        <>
            <div id="team-layout-container">
                <div id="team-banner">

                </div>
                <div id="team-info-wrapper" onLoad={handleLoad}>
                    {
                        rosters.map((team: string, index: number) => {
                            const newRoster = roster.filter((player: any) => {
                                return player.TeamAffiliation = team;
                            });
                            return <Roster key={index} roster={newRoster} />
                        })
                    }
                </div>
                <Match />
            </div>
        </>
    );
}

function Roster(props: any) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="roster-container" >
                <div className="roster-container-clickable" onClick={() => { setIsOpen(true) }}>
                    <h1>RAAAAAAAA</h1>
                </div>
                <div className="roster-display">
                    { isOpen &&
                        <>
                            {
                                props.roster.map((player: any, index: number) => {
                                    return <Player key={index} player={player.name} />
                                })
                            }
                        </>
                    }
                </div>
                
            </div>
        </>
    );
}

function Player(props: any) {
    return (
        <>
            <div className="player-container">
                <div className="player-img">
                </div>
                <h3>
                    {props.player}
                </h3>
            </div>
        </>
    );
}

function Match(props: any) {
    const d = new Date(1711036038 * 1000);
    const timeZone = 'America/New_York';
    const formatter = d.toLocaleString('en-US', {
        timeZone: timeZone,
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    });
    
    const [datePart, timePart] = formatter.split(',');

    return (
        <>
                <div>
                <p>
                    if(match not ended)
                    props.match.title
                    props.match.HomeTeam  VS props.match.AwayTeam    
                </p>
                <p> 
                    '${datePart}    ${timePart}'
                </p>
                </div>
                   
        </>
        
    );
}