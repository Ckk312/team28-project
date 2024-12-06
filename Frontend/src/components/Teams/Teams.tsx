
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
                        return <TeamCards image={team[1]} name={team[0]} />;
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
function TeamCards(props: any) {

    return (
        <>
            
        </>
    )
}