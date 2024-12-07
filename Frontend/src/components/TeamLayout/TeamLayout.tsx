import React, { useEffect, useState, createContext, useContext, memo } from "react";
import Error from '../Error/Error'
import './TeamLayout.css';
import { useUser } from "../../context/UserContext";

async function getRoster(title: string): Promise<any[]> {
    try {
        const header = new Headers();
        header.append('Content-Type', 'application/json');

        const response = await fetch('http://www.ckk312.xyz:5000/api/searchdocuments', {
            method: 'POST',
            body: JSON.stringify({ collection: 'All Teams' , query: title + ' Knights', searchKeys: ['Game'] }),
            headers: header
        });

        const result = await response.json();
        return result.result;
    } catch (e) {
        console.error(e);
        return [];
    }
    
}

async function updateName(oldPlayer: string, newPlayer: string): Promise<boolean> {
    let result;
    try {
        const header = new Headers();
        header.append('Content-Type', 'application/json');

        const response = await fetch('https://www.ckk312.xyz/api/searchdocuments', {
            method: 'POST',
            body: JSON.stringify({ collection: 'All Teams' , query: oldPlayer, searchKeys: ['Username'] }),
            headers: header
        });

        result = await response.json();
    } catch (e) {
        console.error(e);
        return false;
    }

    try {
        const edit = await fetch('https://www.ckk312.xyz/api/updatedocuments', {
            method: 'POST',
            body: JSON.stringify({
                collection: 'All Teams', 
                _id: result._id, 
                username: newPlayer,
                game: result.Game,
                teamaffiliation: result.TeamAffiliation
            })
        });

        const error = await edit.json();

        if (error.error !== '') {
            throw Error;
        }
    } catch (e) {
        console.error(e);
        return false;
    }

    return true;
}

const CardContext = createContext<{isOpen: boolean, isEdit: boolean}>({ isOpen: false, isEdit: false });

/***
 * Team Layout React Component
 * 
 */
export default function TeamLayout() {
    const [roster, setRoster] = useState<any[]>([]);
    const [isError, setIsError] = useState<boolean>(false);
    

    let path = window.location.pathname;
    const game = path.split('/');

    const allRosters = ['Knights', 'Knights Academy', 'Knights Rising', 'Knights Pink']
    let rosterNum = 2;

    if (game.at(-1) === 'Valorant') {
        rosterNum = 4;
    }

    else if (game.at(-1) === 'Splatoon3') {
        game.pop();
        game.push('Splatoon');
        rosterNum = 3;
    }

    else if (game.at(-1) === 'SmashUltimate') {
        game.pop();
        game.push('SmashBrosUltimate');
        rosterNum = 1;
    }

    const rosters = allRosters.slice(0, rosterNum);

    const handleLoad = async () => {
        const stuff = await getRoster(game.at(-1)!);
        setRoster(stuff);
        if (stuff.length === 0) {
            setIsError(true);
            return null;
        }
    }

    useEffect(() => {
        if (!handleLoad()) {
            setIsError(true);
        };
    });

    if (isError) {
        return <Error />
    }

    let teamName: string;

    return (
        <>
            <div id="team-layout-container">
                <button
                    id="return-to-teams-button"
                    type="button"
                    value="< Teams"
                    onClick={(e) => {
                        e.preventDefault();
                        window.location.pathname = '/teams'
                    }} 
                >Teams</button>
                <div id="team-banner">
                    <h1 className = "game-title"> {game.at(-1)} </h1>
                    <img src="https://i.ibb.co/gr6xvCv/COD-Logo.webp" alt=""/>
                </div>
                <div id="team-info-wrapper" >
                    {
                        rosters.map((team: string, index: number) => {
                            const newRoster = roster.filter((player) => {
                                console.log(player.item.Game.replaceAll(' ', '') + ' ' + game.at(-1));
                                return player.item.TeamAffiliation === team && player.item.Game.replaceAll(' ', '') === game.at(-1);
                            });
                            if (newRoster.length !== 0) {
                                teamName = newRoster[0].item.Game;
                            }
                            return <Roster key={index} roster={newRoster} game={teamName + ' ' + team} />
                        })
                    }
                </div>
            </div>
        </>
    );
}

function Roster(props: any) {
    const [isOpen, setIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const { isLoggedIn } = useUser();

    const roster = props.roster;

    return (
        <>
            <CardContext.Provider value={{isOpen, isEdit}} >
                <div className="roster-container" >
                    <div className="roster-container-clickable" onClick={(e) => { 
                        e.preventDefault();
                        setIsOpen(isOpen ? false : true);
                    }}>
                        <h1>{props.game}</h1>
                        { isLoggedIn &&
                            <button
                                className="roster-edit-button"
                                type="button"
                                value={isEdit ? 'Edit' : 'Confirm'}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsEdit(isEdit ? false : true);
                                }}
                            >{isEdit ? 'Confirm' : 'Edit'}</button>
                        }
                    </div>
                    
                    <div className="roster-display">
                        { isOpen &&
                            <>
                                {
                                    roster.map((player: any, index: number) => {
                                        return <Player key={index} player={player.item} edit={isEdit} />
                                    })
                                }
                                <Match />
                            </>
                        }
                    </div>
                    
                </div>
            </CardContext.Provider>
            
        </>
    );
}

function Player(props: any) {
    const [playerTextValue, setPlayerTextValue] = useState(props.player.Username);
    const { isLoggedIn } = useUser();
    const { isOpen, isEdit } = useContext(CardContext);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        updateName(props.player.Username, playerTextValue);
        return;
    }

    return (
        <>
            <div className="player-container">
                <div className="player-img">
                    <img className = "player-image" src={props.player.Img || "https://i.ibb.co/ncCbrRS/360-F-917122367-k-Spdp-RJ5-Hcmn0s4-WMd-Jb-SZpl7-NRzwup-U.webp"} alt={`"${props.player.Img}"`}/>
                </div>
                <div className="player-name" >
                    { isLoggedIn === isEdit &&
                        <form className="player-form" onSubmit={handleSubmit}>
                            <input
                                className="player-input"
                                type="text"
                                value={ playerTextValue }
                                onChange={(e) => { setPlayerTextValue(e.target.value) }}
                            />
                            <input
                                className="player-submit"
                                type="submit"
                            />
                        </form>   
                    }
                    <h3>
                        {props.player.Username}
                    </h3>
                </div>                
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
                    Next Upcoming Match
                    <br/>
                    props.match.title && props.match.TeamAffilicaiton
                    <br/>
                    props.match.HomeTeam  VS props.match.AwayTeam    
                </p>
                <p> 
                    {datePart} {timePart}
                </p>
                </div>
                   
        </>
        
    );
}