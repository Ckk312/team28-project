import React, { useEffect, useState, createContext, useContext, memo } from "react";
import Error from '../Error/Error'
import './TeamLayout.css';
import { useUser } from "../../context/UserContext";
import { updateName, getRoster, getMatches, getFutureMatches } from './Helper';

const CardContext = createContext<{isOpen: boolean, isEdit: boolean, captainExists: boolean}>({ isOpen: false, isEdit: false, captainExists: false });

/***
 * Team Layout React Component
 * 
 */
export default function TeamLayout() {
    // use states
    const [roster, setRoster] = useState<any[]>([]);
    const [isError, setIsError] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(true);

    // get pathname for designation of teams
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
        setLoading(false);
        setRoster(stuff);
        if (stuff.length === 0) {
            setIsError(true);
            return null;
        }
    }

    useEffect(() => {
        if (!handleLoad()) {
            setIsError(true);
        }
    });

    if (isError) {
        return <Error />
    }

    if (isLoading) {
        return (
            <div
              style={{
                display: "flex",
                justifyContent: "center", 
                alignItems: "center",    
                height: "100vh",         
              }}
            >
              <p
                style={{
                  fontSize: "3rem",       // Makes the text larger
                  fontFamily: "Impact, sans-serif", // Uses Impact font or fallback
                  color: "#333",          // Optional: Set a text color
                }}
              >
                Loading...
              </p>
            </div>
          );
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
                </div>
                <div id="team-info-wrapper">
                    {
                        rosters.map((team: string, index: number) => {

                            // Filter the roster based on the team and game
                            const newRoster = roster.filter((player) => {
                                return (player?.TeamAffiliation === team && player?.Game?.replaceAll(' ', '') === game.at(-1));
                            });
                            if (newRoster.length !== 0) {
                                teamName = newRoster[0].Game;
                            }

                            // Return 
                            return <Roster key={index} roster={newRoster} game={teamName + ' ' + team} />
                        })
                    }
                </div>
            </div>
        </>
    );
}

function Roster(props: any) {
    let captain: boolean = false;
    const roster = props.roster;
    for (const player of roster) {
        // Get the club status of a player if it exists
        const status = player?.ClubStatus?.trim();
        if (!status) {
            continue;
        }
        if (status.toLowerCase() === 'captain') {
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
            <CardContext.Provider value={{isOpen, isEdit, captainExists}} >
                <div className="roster-container">
                    <div className="roster-container-clickable">
                        <h1>{props.game}</h1>
                        <button
                            className="expand-button"
                            style={{margin : "5px"}}
                            onClick={() => setIsOpen(isOpen ? false : true)}
                        >
                        {isOpen ? "Hide Details" : "View Details"}
                        </button>
                        <br/>   
                        { isOpen && isLoggedIn && <br/> && 
                            <button

                                className="roster-edit-button"
                                type="button"
                                value={isEdit ? 'Edit' : 'Confirm'}
                                style={{margin : "5px"}}
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
                                {roster.map((player: any, index: number) => (
                                    <Player key={index} player={player} edit={isEdit} />
                                ))}

                                {roster.length > 0 ? (
                                    <Match match={roster[0]} />
                                ) : (
                                    <div>No upcoming match found.</div>
                                )}
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
    const [roleTextValue, setRoleTextValue] = useState(props.player.Role);
    const [isCaptain, setIsCaptain] = useState(false);
    const { isLoggedIn } = useUser();
    const { isEdit, captainExists } = useContext(CardContext);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // console.log(props.player.Username + " " + playerTextValue);
        updateName(props.player.Username, {username: playerTextValue, role: roleTextValue, });
        return;
    }

    return (
        <div className="player-card">
            <div className="player-card-img-container">
                <img
                    className="player-card-img"
                    src={props.player.Img || "https://i.ibb.co/ncCbrRS/360-F-917122367-k-Spdp-RJ5-Hcmn0s4-WMd-Jb-SZpl7-NRzwup-U.webp"}
                    alt={`Image of ${props.player.Username}`}
                />
            </div>
            <div className="player-card-info">
                {isLoggedIn && isEdit ? (
                    <form className="player-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="player-username">Username:</label>
                            <input
                                className="player-input"
                                id="player-username"
                                name="player-username"
                                type="text"
                                value={playerTextValue}
                                onChange={(e) => setPlayerTextValue(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="player-role">Role:</label>
                            <input
                                className="player-input"
                                id="player-role"
                                name="player-role"
                                type="text"
                                value={roleTextValue}
                                onChange={(e) => setRoleTextValue(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                id="is-captain"
                                name="is-captain"
                                type="checkbox"
                                value="captain"
                                checked={isCaptain}
                                onChange={() => setIsCaptain(!isCaptain)}
                            />
                            <label htmlFor="is-captain">Set as Captain</label>
                        </div>
                    </form>
                ) : (
                    <>
                        {isCaptain && <h1 className="captain-badge">**</h1>}
                        <h2 className="player-name">{props.player.Username}</h2>
                        <h3 className="player-role">{props.player.Role}</h3>
                    </>
                )}
            </div>
        </div>
    );
    

    /*
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
                            <input
                                name="is-captain"
                                type="checkbox" 
                                value="captain"
                                checked={ isCaptain } 
                                onChange={() => {
                                    setIsCaptain(isCaptain ? false : true);
                            }}/>
                            <label htmlFor="is-captain">Set as Captain</label>
                            <input
                                className="player-submit"
                                type="submit"
                            />
                        </form>
                    }
                    { isCaptain && 
                        <h1>**</h1>
                    }
                    <h2>
                        {props.player.Username}
                    </h2>
                    <h3>
                        {props.player.Role}
                    </h3>
                </div>                
            </div>
        </>
    );
    */
}

function Match(props: any) {
    const match = props.match || {};
    const [nextMatch, setNextMatch] = useState<any | null>(null);

    useEffect(() => {
        if (!match.Game || !match.TeamAffiliation) {
            console.warn("Invalid match data:", match);
            return;
        }

        const fetchMatches = async () => {
            const allMatches = await getMatches(match.Game, match.TeamAffiliation);
            const futureMatches = getFutureMatches(allMatches);
            setNextMatch(futureMatches[0] || null);
        };

        fetchMatches();
    }, [match.Game, match.TeamAffiliation]);

    if (!match.Game || !match.TeamAffiliation) {
        return <div>No valid match data available.</div>;
    }


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
