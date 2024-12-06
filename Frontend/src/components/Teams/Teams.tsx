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
                    teamInfo.map((team) => {
                        return <TeamCard image={team[1]} name={team[0]} />;
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

    return (
        <>
            <div className="team-cards" onClick={() => { window.location.href = '/teams/' + (props.name as string).replaceAll(' ', '') }}>
                <p>
                    {props.name}
                </p>
                <img src={props.image} alt={props.name}/>
            </div>
        </>
    )
}