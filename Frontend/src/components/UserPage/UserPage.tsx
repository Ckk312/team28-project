import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './UserPage.css';
import { getUserTeams, getMatches } from '../TeamLayout/Helper'; // Assume this fetches games for a user

export default function UserPage() {
    const { name } = useParams(); // Retrieve the username from the URL
    const [games, setTeams] = useState<any[]>([]);
    const [userMatches, setUserMatches] = useState<any[]>([]);
    const [loadingTeams, setLoadingTeams] = useState(true);
    const [loadingMatches, setLoadingMatches] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!name) {
            setError(true);
            setLoadingTeams(false);
            return;
        }
        const fetchUserTeams = async () => {
            try {
                const data = await getUserTeams(name); // Fetch games for the user
                setTeams(data);
                setLoadingTeams(false);
            } catch (err) {
                console.error("Error fetching user games:", err);
                setError(true);
                setLoadingTeams(false);
            }
        };

        fetchUserTeams();
    }, [name]);

    // Once we have the user's teams, fetch their matches
    useEffect(() => {
        const fetchAllMatches = async () => {
            if (games.length === 0) {
                setLoadingMatches(false);
                return;
            }

            try {
                let allMatches: any[] = [];
                for (const team of games) {
                    // Each "team" object should include Game and TeamAffiliation
                    const { Game, TeamAffiliation } = team;
                    if (Game && TeamAffiliation) {
                        const matches = await getMatches(Game, TeamAffiliation);

                        // Add to each match in the matches the TeamAffiliation
                        matches.forEach((match: any) => {
                            match.TeamAffiliation = TeamAffiliation;
                        });
                        allMatches = [...allMatches, ...matches];
                    }
                }
                // log the matches for debugging
                console.log("allMatches", allMatches);

                setUserMatches(allMatches);
                setLoadingMatches(false);
            } catch (err) {
                console.error("Error fetching matches for user teams:", err);
                setError(true);
                setLoadingMatches(false);
            }
        };

        // Only fetch matches after we've retrieved teams
        if (!loadingTeams && !error) {
            fetchAllMatches();
        }
    }, [games, loadingTeams, error]);

    if (loadingTeams || loadingMatches) {
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

    if (error) {
        return <div>Failed to load matches for {name}.</div>;
    }

    // Log all the games for the user
    console.log(games);

    return (
        <>
            <div id="user-page-container">
            <h1>{name}'s Games</h1>
            {userMatches.length > 0 ? (
                <ul>
                    {userMatches.map((match, index) => (
                        <li key={index}>
                            <div className="game-card">
                                <h2>{match.Game}</h2>
                                <p><strong>Team:</strong> {match.TeamAffiliation}</p>
                                <p><strong>Date:</strong> {new Date(match.Date * 1000).toLocaleString()}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No matches found for {name}.</p>
            )}
            </div>
        </>
    );
}