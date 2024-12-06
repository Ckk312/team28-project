import { useState } from "react";

async function getRoster(title: string): Promise<any> {
    const header = new Headers();
    header.append('Content-type', 'application/json')

    return await fetch('https://www.ckk312.xyz/api/searchdocuments', {
        method: 'POST',
        body: JSON.stringify({ collection: 'All Teams' ,query: title }),
        headers: header
    });
}

/***
 * Team Layout React Component
 * 
 */
export default function TeamLayout(props: any) {
    const [roster, setRoster] = useState<any[]>([]);

    let path = window.location.pathname;
    const game = path.split(',');

    const allRosters = ['Knights', 'Knights Academy', 'Knights Rising', 'Knights Pink']
    let rosterNum = 2;

    if (game[-1] === 'Valorant') {
        rosterNum = 4;
    }

    else if (game[-1] === 'Splatoon') {
        rosterNum = 3;
    }

    else if (game[-1] === 'Smash') {
        rosterNum = 1;
    }

    const rosters = allRosters.slice(rosterNum);

    const handleLoad = async () => {
        setRoster((await getRoster(game[-1])).result);
    }

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
                            })
                            return <Roster key={index} roster={roster} />
                        })
                    }

                </div>
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


    return ();
}