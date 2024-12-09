import React, { useEffect, useState, createContext, useContext, memo, useRef } from "react";
import Error from '../Error/Error'
import './TeamLayout.css';
import { useUser } from "../../context/UserContext";
import { updateName, getRoster, getMatches, getFutureMatches, spaceUppercase, getPastMatches, sortClubStatus } from'./Helper';

import type { Player as Players, Match as Matches } from '../../types';
import { useNavigate } from "react-router-dom";

const CardContext = createContext<{ 
    isOpen: boolean, 
    isEdit: boolean, 
    captainExists: boolean, 
    setCaptainExists: (status: boolean) => void
}>({ isOpen: false, isEdit: false, captainExists: false, setCaptainExists: (status: boolean) => {} });

memo(Roster);

/***
 * Team Layout React Component
 * 
 */
export default function TeamLayout() {
    const navigate = useNavigate();
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

    else if (game.at(-1) === 'CounterStrike') {
        game.pop();
        game.push('Counter-Strike2');
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
                        navigate('/teams');
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
        if (player.ClubStatus === 'Captain') {
            captain = true;
            break;
        }
    }

    const [isOpen, setIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [captainExists, setCaptainExists] = useState(captain);
    const { isLoggedIn } = useUser();
    
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
                        </div>
                    </div>
                    
                    <div className="roster-display">
                        { isOpen &&
                            <>
                                {
                                    sortClubStatus(roster).map((player: Players, index: number) => {
                                        return <Player key={index} player={player} edit={isEdit} />
                                    })
                                }
                                <div id="match-info">
                                    <Match match={roster[0]}/>
                                </div>
                            </>
                        }
                    </div>
                    
                </div>
            </CardContext.Provider>
        </>
    );
}

function Player(props: any) {
    console.log(props);
    const [playerTextValue, setPlayerTextValue] = useState<string>(props.player.Username);
    const [roleTextValue, setRoleTextValue] = useState<string | undefined>(props.player.Role);
    const [rankTextValue, setRankTextValue] = useState<string | undefined>(props.player.Rank);
    const [clubStatusTextValue, setClubStatusTextValue] = useState<string>(props.player.ClubStatus);
    const [mainCharTextValue, setMainCharTextValue] = useState<string | undefined>(props.player.MainCharacter);
    const [descTextValue, setDescTextValue] = useState<string | undefined>(props.player.Description);
    const [errorText, setErrorText] = useState<string>('');
    const clubStatusRef = useRef(props.player.ClubStatus);
    const playerForm = useRef(props.player);
    const { isLoggedIn } = useUser();
    const { isEdit, captainExists, setCaptainExists } = useContext(CardContext);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

        const newPlayer: Players = { 
            Username: playerTextValue, 
            Role: roleTextValue, 
            Game: props.player.Game, 
            TeamAffiliation: props.player.TeamAffiliation ,
            Rank: rankTextValue,
            MainCharacter: mainCharTextValue,
            ClubStatus: clubStatusTextValue,
            Description: descTextValue
        }

        if (!(await updateName(props.player.Username, newPlayer))) {
            setErrorText('Could not upload changes.');
            return;
        };

        playerForm.current = newPlayer;
        setErrorText('Player updated');
        return;
    }

    return (
        <>
            <div className="player-container">
                <div className="player-img">
                    <img className = "player-image" src={props.player.Img || "https://i.ibb.co/ncCbrRS/360-F-917122367-k-Spdp-RJ5-Hcmn0s4-WMd-Jb-SZpl7-NRzwup-U.webp"} alt={`"${props.player.Img}"`}/>
                </div>
                <div className="player-info" >
                    { (isLoggedIn === true && isEdit === true) &&
                        <form className="player-form" onSubmit={handleSubmit}>
                            <label htmlFor="player-username">Username:</label>
                            <input
                                className="player-input"
                                name="player-username"
                                type="text"
                                value={ playerTextValue }
                                onChange={(e) => { 
                                    setPlayerTextValue(e.target.value);
                                    setErrorText('');
                                }}
                            />
                            <label htmlFor="player-role">Role:</label>
                            <input
                                className="player-input"
                                name="player-role"
                                type="text"
                                value={ roleTextValue }
                                onChange={(e) => { 
                                    setRoleTextValue(e.target.value)
                                    setErrorText('');
                                }}
                            />
                            <label htmlFor="player-rank">Rank:</label>
                            <input
                                className="player-input"
                                name="player-rank"
                                type="text"
                                value={ rankTextValue }
                                onChange={(e) => {
                                    setRankTextValue(e.target.value)
                                    setErrorText('');
                                }}
                            />
                            <label htmlFor="player-rank">Main Character:</label>
                            <input
                                className="player-input"
                                name="player-rank"
                                type="text"
                                value={ mainCharTextValue }
                                onChange={(e) => {
                                    setMainCharTextValue(e.target.value)
                                    setErrorText('');
                                }}
                            />
                            <label htmlFor="player-desc">Description:</label>
                            <input
                                className="player-input"
                                name="player-desc"
                                type="text"
                                value={ descTextValue }
                                onChange={(e) => {
                                    setDescTextValue(e.target.value);
                                    setErrorText('');
                                }}
                            />
                            <label htmlFor="club-status-captain" className="radio-label">Captain</label>
                            <input
                                name="club-status-captain"
                                type="radio" 
                                value="Captain"
                                checked={ clubStatusTextValue === 'Captain' }
                                onChange={(e) => {
                                    setClubStatusTextValue(e.target.value);
                                    setErrorText('');
                                }}
                            />
                            <label htmlFor="club-status-co-captain">Co-Captain</label>
                            <input
                                name="club-status-co-captain"
                                type="radio" 
                                value="Co-Captain"
                                checked={ clubStatusTextValue === 'Co-Captain' }
                                onChange={(e) => {
                                    setClubStatusTextValue(e.target.value);
                                    setErrorText('');
                                }}
                            />
                            <label htmlFor="club-status-member">Member</label>
                            <input
                                name="club-status-member"
                                type="radio" 
                                value="Member"
                                checked={ clubStatusTextValue === 'Member' }
                                onChange={(e) => {
                                    setClubStatusTextValue(e.target.value);
                                    setErrorText('');
                                }}
                            />
                            <input
                                className="player-submit"
                                type="submit"
                            />
                            <p>{ errorText }</p>
                        </form>
                    }
                    <h2>{playerForm.current.Username}</h2>
                    <h3>{playerForm.current.ClubStatus}</h3>
                    <h3>{'Role: ' + playerForm.current.Role}</h3>
                    { playerForm.current.Rank && <p>{'Rank: ' + playerForm.current.Rank}</p> }
                    { playerForm.current.MainCharacter && <p>{'Main Character: ' + playerForm.current.MainCharacter}</p> }
                    { playerForm.current.Description && <a href={playerForm.current.Description}>{playerForm.current.Description}</a> }
                </div>                
            </div>
        </>
    );
}

function Match(props: any) {
    const [nextMatch, setNextMatch] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [prevMatches, setPrevMatches] = useState<any[]>([]);
    console.log("testing");
    console.log(props.match.Game);

    useEffect(() => {
        const fetchMatches = async () => {
            // Fetch matches based on game and team affiliation
            const allMatches = await getMatches(`${props.match.Game}`, `UCF ${props.match.TeamAffiliation}`);
            console.log("Returned Matches");
            console.log(allMatches);
            //console.log(allMatches);
            // Find the next match
            const nextMatch = getFutureMatches(allMatches);
            const prevMatches = getPastMatches(allMatches);
            console.log("List of prev matches");
            console.log(prevMatches);
            console.log("list of next matches");
            console.log(nextMatch);
            //console.log(nextMatch);
            // Update the state with the next match
            setNextMatch(nextMatch);
            setPrevMatches(prevMatches);
            setLoading(false);
        };

        fetchMatches();
    }, [props.match.Game, props.match.TeamAffiliation]);


    // If no next match is found, display a message
    if (nextMatch.length <= 0 && prevMatches.length <= 0) {
        return (
            <div>
                <pre>No upcoming matches found.</pre>
                <pre>No previous matches found.</pre>
            </div>
        );
    }

    const decideColor = (score1: number, score2: number) : {backgroundColor: string} => {
        if (score1 > score2) {
            return {
                backgroundColor: 'rgba(5, 255, 80, 0.673)',
            };
        }
        else if (score1 < score2) {
            return {
                backgroundColor: 'rgba(255, 59, 5, 0.673)'
            };
        }
        else {
            return {
                backgroundColor: 'rgba(255, 201, 5, 0.673)'
            };
        }
    }

    return (
        <>
            {/* Next Upcoming Match */}
            {nextMatch.length > 0 && (
                <>
                    <h2>
                    Next Upcoming Match
                    </h2>
                    <div className="match-container">
                        <div className="match-up">
                            <h3 className="home">{nextMatch[0].HomeTeam}</h3>
                            <h2>VS</h2>
                            <h3>{nextMatch[0].AwayTeam}</h3>
                        </div>
                        <p>
                            {new Date(nextMatch[0].date).toLocaleString("en-US", {
                                month: "numeric",
                                day: "numeric",
                                year: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                            })}
                        </p>
                    </div>
                </>
            )}

            {/* Previous Matches */}
            {prevMatches.length > 0 && (
                <>
                    <h2>Previous Matches</h2>
                    {prevMatches.slice(0, 3).map((match, index) => {
                        const matchDate = new Date(match.date);
                        const formattedDate = matchDate.toLocaleString("en-US", {
                            month: "numeric",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                        });

                        const [datePart, timePart] = formattedDate.split(",");

                        return (
                            <div className="match-container" key={index} style={decideColor(match.HomeScore, match.AwayScore)}>
                                <div className="match-up">
                                    <h3>{match.HomeScore + ' - '}</h3>
                                    <h3>{match.HomeTeam}</h3>
                                    <h2>VS</h2>
                                    <h3>{match.AwayTeam}</h3>
                                    <h3>{' - ' + match.AwayScore}</h3>
                                </div>
                                <br />
                                <p>{formattedDate}</p>
                                {match.VOD && 
                                    <a href={match.VOD}> 
                                        VOD
                                    </a>
                                }
                                {!match.VOD && 
                                    <p>
                                        No VOD available
                                    </p>
                                }
                            </div>
                        );
                    })}
                </>
            )}
        </>
    );
}
