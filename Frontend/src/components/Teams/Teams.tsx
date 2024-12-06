import React from "react";


/***
 * 
 */
export default function Teams() {

    return (
        <>
            <div id="team-container">
                <h1>Here are our teams</h1>
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
            <div>
                <p>
                    {props.name}
                </p>
                <img src={props.image} alt={props.name}/>
            </div>
        </>
    )
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