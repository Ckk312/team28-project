import React, { useEffect, useState, createContext, useContext, memo, useRef } from "react";
import Error from '../Error/Error'
import './TeamLayout.css';
import { useUser } from "../../context/UserContext";
import { updateName, getRoster, getMatches, getFutureMatches, spaceUppercase } from'./Helper';

import type { Player as Players, Match as Matches } from '../../types';

const CardContext = createContext<{ 
    isOpen: boolean, 
    isEdit: boolean, 
    captainExists: boolean, 
    setCaptainExists: (status: boolean) => void
}>({ isOpen: false, isEdit: false, captainExists: false, setCaptainExists: (status: boolean) => {} });

memo(Roster);
memo(Player);

/***
 * Team Layout React Component
 * 
 */
export default function TeamLayout() {
    // use states
    const [roster, setRoster] = useState<Players[]>([]);
    const [isError, setIsError] = useState<boolean>(false);

    // get pathname for designation of teams
    let path = window.location.pathname;
    const game = path.split('/');

    const allRostersNames = ['Knights', 'Knights Academy', 'Knights Rising', 'Knights Pink']
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

    const rosters = allRostersNames.slice(0, rosterNum);

    const handleLoad = async () => {
        const stuff = (await getRoster(game.at(-1)!));
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
    }, []);

    if (isError) {
        return <Error />
    }

    const gameName = spaceUppercase(game.at(-1)!);

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
                    <h1 className = "game-title"> {gameName} </h1>
                </div>
                <div id="team-info-wrapper">
                    {
                        rosters.map((team: string, index: number) => {
                            const newRoster: Players[] = roster.filter((player) => {
                                return (player.TeamAffiliation === team && player.Game.replaceAll(' ', '') === game.at(-1));
                            });
                            return <Roster key={index} roster={newRoster} game={gameName + ' ' + team + ' Roster'} />
                        })
                    }
                </div>
            </div>
        </>
    );
}

function Roster(props: any) {
    let captain: boolean = false;
    const roster: Players[] = props.roster;
    for(const player of roster) {
        if (player.ClubStatus?.toLowerCase() === 'captain') {
            captain = true;
            break;
        }
    }

    const [isOpen, setIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [captainExists, setCaptainExists] = useState(captain);
    const { isLoggedIn } = useUser();

    console.log('hello');
    
    return (
        <>
            <CardContext.Provider value={{isOpen, isEdit, captainExists, setCaptainExists}} >
                <div className="roster-container">
                    <div className="roster-container-clickable">
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
                        <div className="roster-arrow"
                            onClick={(e) => { 
                                e.preventDefault();
                                setIsOpen(isOpen ? false : true);
                            }}>
                            CLICK ME!!!!
                        </div>
                    </div>
                    
                    <div className="roster-display">
                        { isOpen &&
                            <>
                                {
                                    roster.map((player: Players, index: number) => {
                                        return <Player key={index} player={player} edit={isEdit} />
                                    })
                                }
                                <Match match={roster[0]}/>
                            </>
                        }
                    </div>
                    
                </div>
            </CardContext.Provider>
        </>
    );
}

function Player(props: any) {
    const [playerTextValue, setPlayerTextValue] = useState<string>(props.player.Username);
    const [roleTextValue, setRoleTextValue] = useState<string | undefined>(props.player.Role);
    const [rankTextValue, setRankTextValue] = useState<string | undefined>(props.player.Rank);
    const [clubStatusTextValue, setClubStatusTextValue] = useState<string>(props.player.ClubStatus);
    const [mainCharTextValue, setMainCharTextValue] = useState<string | undefined>(props.player.MainCharacter);
    const [errorText, setErrorText] = useState<string>('');
    const clubStatusRef = useRef(props.player.ClubStatus);
    const { isLoggedIn } = useUser();
    const { isEdit, captainExists, setCaptainExists } = useContext(CardContext);

    console.log('urmom');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (clubStatusRef.current !== 'Captain' && clubStatusTextValue === 'Captain' && captainExists) {
            setErrorText('Cannot Submit. Only one captain per team.');
            return;
        }

        if (clubStatusRef.current === 'Captain' && clubStatusRef.current !== clubStatusTextValue) {
            setCaptainExists(false);
        }

        if (!captainExists && clubStatusTextValue === 'Captain') {
            setCaptainExists(true);
        }

        updateName(props.player.Username, { 
            Username: playerTextValue, 
            Role: roleTextValue, 
            Game: props.player.Game, 
            TeamAffiliation: props.player.TeamAffiliation ,
            Rank: rankTextValue,
            MainCharacter: mainCharTextValue,
            ClubStatus: clubStatusTextValue
        });
        return;
    }

    return (
        <>
            <div className="player-container">
                <div className="player-img">
                    <img className = "player-image" src={props.player.Img || "https://i.ibb.co/ncCbrRS/360-F-917122367-k-Spdp-RJ5-Hcmn0s4-WMd-Jb-SZpl7-NRzwup-U.webp"} alt={`"${props.player.Img}"`}/>
                </div>
                <div className="player-name" >
                    { (isLoggedIn === true && isEdit === true) &&
                        <form className="player-form" onSubmit={handleSubmit}>
                            <label htmlFor="player-username">Username:</label>
                            <input
                                className="player-input"
                                name="player-username"
                                type="text"
                                value={ playerTextValue }
                                onChange={(e) => { setPlayerTextValue(e.target.value) }}
                            />
                            <label htmlFor="player-role">Role:</label>
                            <input
                                className="player-input"
                                name="player-role"
                                type="text"
                                value={ roleTextValue }
                                onChange={(e) => { setRoleTextValue(e.target.value) }}
                            />
                            <label htmlFor="player-rank">Rank:</label>
                            <input
                                className="player-input"
                                name="player-rank"
                                type="text"
                                value={ rankTextValue }
                                onChange={(e) => { setRankTextValue(e.target.value) }}
                            />
                            <label htmlFor="player-rank">Main Character:</label>
                            <input
                                className="player-input"
                                name="player-rank"
                                type="text"
                                value={ mainCharTextValue }
                                onChange={(e) => { setMainCharTextValue(e.target.value) }}
                            />
                            <input
                                name="club-status"
                                type="radio" 
                                value="Captain"
                                checked={ clubStatusTextValue === 'Captain' }
                                onChange={(e) => { setClubStatusTextValue(e.target.value) }}
                            />
                            <label htmlFor="club-status-captain">Captain</label>
                            <input
                                name="club-status-captain"
                                type="radio" 
                                value="Co-Captain"
                                checked={ clubStatusTextValue === 'Co-Captain' }
                                onChange={(e) => { setClubStatusTextValue(e.target.value) }}
                            />
                            <label htmlFor="club-status-co-captain">Co-Captain</label>
                            <input
                                name="club-status-member"
                                type="radio" 
                                value="Member"
                                checked={ clubStatusTextValue === 'Member' }
                                onChange={(e) => { setClubStatusTextValue(e.target.value) }}
                            />
                            <label htmlFor="club-status-member">Member</label>
                            <input
                                className="player-submit"
                                type="submit"
                            />
                            <p>{ errorText }</p>
                        </form>
                    }
                    <h2>{props.player.Username}</h2>
                    <h3>{props.player.ClubStatus}</h3>
                    <h3>{props.player.Role}</h3>
                    <p>{props.player.Rank}</p>
                    <p>{props.player.MainCharacter}</p>
                </div>                
            </div>
        </>
    );
}

function Match(props: any) {
    const [nextMatch, setNextMatch] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    //console.log(props);

    useEffect(() => {
        const fetchMatches = async () => {
            // Fetch matches based on game and team affiliation
            const allMatches = await getMatches(props.match.Game, props.match.TeamAffiliation);
            //console.log(allMatches);
            // Find the next match
            const nextMatch = getFutureMatches(allMatches);
            //console.log(nextMatch);
            // Update the state with the next match
            setNextMatch(nextMatch[0]);
            setLoading(false);
        };

        fetchMatches();
    }, [props.match.Game, props.match.TeamAffiliation]);


    // If no next match is found, display a message
    if (!nextMatch) {
        return <div><pre>No upcoming match found.</pre></div>;
    }

    const matchDate = new Date(nextMatch.date);
    const timeZone = 'America/New_York';

    // Format date as month/day/year hour:minute AM/PM
    const formatter = matchDate.toLocaleString('en-US', {
        timeZone: timeZone,
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true // 12-hour format (AM/PM)
    });

    const [datePart, timePart] = formatter.split(',');


    return (
        <div>
            <p>
                Next Upcoming Match
                <br />
                {nextMatch.HomeTeam} VS {nextMatch.AwayTeam}
                <br />
                {datePart}   @  {timePart}
            </p>
        </div>
    );
}
