import './Teams.css'

/***
 * 
 */
export default function Teams() {
    const teamInfo: [string, string][] = [['Apex Legends', ''], ['Call of Duty', ''], ['League of Legends', ''], ['Overwatch 2', ''], ['Smash Ultimate', ''], ['Splatoon 3', ''], ['Tom Clancy\'s: Rainbow Six Siege', ''], ['Valorant', '']];

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
    let name = props.name;
    if (props.name === 'Tom Clancy\'s: Rainbow Six Siege') {
        name = 'Rainbow Six Siege';
    }

    return (
        <>
            <div className="team-cards" onClick={() => { window.location.href = '/teams/' + (name as string).replaceAll(' ', '') }}>
                <p>
                    {props.name}
                </p>
                <img src={props.image} alt={props.name}/>
            </div>
        </>
    )
}