import { useNavigate } from 'react-router-dom';
import './Teams.css'

/***
 * 
 */
export default function Teams() {
    const teamInfo: [string, string][] = [['Apex Legends', 'https://i.ibb.co/FBCBb7m/Apex-Banner.webp'], ['Call of Duty', 'https://i.ibb.co/gr6xvCv/COD-Logo.webp'], ['League of Legends', 'https://i.ibb.co/xzpdD55/League-Banner.webp'], ['Overwatch 2', 'https://i.ibb.co/ZSm1RLf/Overwatch-Banner.webp'], ['Smash Ultimate', 'https://i.ibb.co/tK45Tgy/SSBU-Banner.webp'], ['Splatoon 3', 'https://i.ibb.co/R04p1bb/Splatoon3-Banner.webp'], ['Tom Clancy\'s: Rainbow Six Siege', 'https://i.ibb.co/KX3PjJV/R6-Logo.webp'], ['Valorant', 'https://i.ibb.co/YDnyPpY/Valorant-Banner.webp'], ['Rocket League', ''], ['CounterStrike', '']];

    return (
        <>
            <div id="team-container">
                <h1>Here are our teams</h1>
                <div id="team-list" >
                {
                    teamInfo.map((team, index) => {
                        return <TeamCard key={index} image={team[1]} name={team[0]} />;
                    })
                }
                </div>
            </div>
        </>
    );
}

/***
 * 
 */
function TeamCard(props: any) {
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
                <img src={props.image} alt={props.name}/>
            </div>
        </>
    )
}