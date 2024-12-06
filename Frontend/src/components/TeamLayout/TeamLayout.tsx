import { useState } from "react";

/***
 * Team Layout React Component
 * 
 */
export default function TeamLayout(props: any) {


    return (
        <>
            <div id="team-layout-container">
                <div id="team-banner">

                </div>
                <div id="team-info-wrapper">
                    <Match />
                </div>
            </div>
        </>
    );
}

function Roster(props: any) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="roster-container" onClick={() => { setIsOpen(true) }}>
                { isOpen &&
                    <>

                    </>    
                }
            </div>
        </>
    );
}

function Player(props: any) {

    return (
        <>
            <div className="player-container">
                <div className="player-img">
                </div>
                <h3>
                    {}
                </h3>
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
                    if(match not ended)
                    props.match.title
                    props.match.HomeTeam  VS props.match.AwayTeam    
                </p>
                <p> 
                    '${datePart}    ${timePart}'
                </p>
                </div>
                   
        </>
        
    );
}