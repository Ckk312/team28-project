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


    return ();
}