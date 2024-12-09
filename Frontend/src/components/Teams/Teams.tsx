import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from '../TeamLayout/Helper';
import './Teams.css';

/***
 * 
 */
export default function Teams() {
    const gameInfo: [string, string][] = [['Apex Legends', 'https://i.ibb.co/FBCBb7m/Apex-Banner.webp'], ['Call of Duty', 'https://i.ibb.co/gr6xvCv/COD-Logo.webp'], ['League of Legends', 'https://i.ibb.co/xzpdD55/League-Banner.webp'], ['Overwatch 2', 'https://i.ibb.co/ZSm1RLf/Overwatch-Banner.webp'], ['Smash Ultimate', 'https://i.ibb.co/tK45Tgy/SSBU-Banner.webp'], ['Splatoon 3', 'https://i.ibb.co/R04p1bb/Splatoon3-Banner.webp'], ['Tom Clancy\'s: Rainbow Six Siege', 'https://i.ibb.co/KX3PjJV/R6-Logo.webp'], ['Valorant', 'https://i.ibb.co/YDnyPpY/Valorant-Banner.webp'], ['Rocket League', ''], ['CounterStrike', '']];
    
    // Create a string array of all the names (string at index 0 of each entry) of games from the gameInfo array
    const gameNames = gameInfo.map(([name]) => name);

    const [users, setUsers] = useState<any[]>([]); // State to store teams from the database
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // State to track search input
    const [searchText, setSearchText] = useState('');

    // Filter games and users based on search input
    const filteredGames = gameInfo.filter(([name]) =>
        name.toLowerCase().includes(searchText.toLowerCase())
    );

    const filteredUsers = users.filter(
        (user) =>
            user.TeamAffiliation?.toLowerCase().includes(searchText.toLowerCase()) ||
            user.Username?.toLowerCase().includes(searchText.toLowerCase())
    );

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getAllUsers(gameNames);
                // log the data for debugging
                const uniqueUsers = Array.from(
                    new Map(data.map((user) => [user.Username, user])).values()
                );
                setUsers(data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to load teams:", err);
                setError(true);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
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

    return (
        <>
            <div id="team-container">
                <div id="search-bar">
                    <input
                        type="text"
                        placeholder="Search for a game or user..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>
                <h1 style={{ color: 'black'}}>Games</h1>
                <div id="team-list">
                    {filteredGames.map((game, index) => (
                        <GameCard key={index} image={game[1]} name={game[0]} />
                    ))}
                    {filteredGames.length === 0 && <p>No games found.</p>}
                </div>
            </div>
            <div id="user-container">
                <h1 style={{ color: 'black'}}>Users</h1>
                <div id="user-list">
                    {filteredUsers.map((user, index) => (
                        //console.log('Team:', user),
                        <UserCard key={index} TeamName={user.TeamAffiliation} UserName={user.Username} />
                    ))}
                    {filteredUsers.length === 0 && <p>No users found.</p>}
                </div>
            </div>
        </>
    );
}

/***
 * 
 */
function GameCard(props: any) {
    const navigate = useNavigate();

    let name = props.name;
    if (props.name === 'Tom Clancy\'s: Rainbow Six Siege') {
        name = 'Rainbow Six Siege';
    }

    return (
        <>
            <div className="team-cards" onClick={() => { navigate('/teams/' + (name as string).replaceAll(' ', '')) }}>
                <p>
                    {props.name}
                </p>
                
            </div>
        </>
    )
}

function UserCard(props: any) {
    const navigate = useNavigate();

    // Print the props info for debugging
    // console.log('UserCard Props:', props);

    return (
        <>
            <div className="team-cards" onClick={() => { navigate('/user/' + (props.UserName as string)) }}>
                <p>
                    {props.TeamName}
                </p>
                <p>
                    {props.UserName}
                </p>
                
            </div>
        </>
    )
}

