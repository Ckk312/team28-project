// helper file
// sorted by player functions -> team functions -> match functions

export async function updateName(oldPlayer: string, newPlayer: string): Promise<boolean> {
    let result;
    try {
        const header = new Headers();
        header.append('Content-Type', 'application/json');

        const response = await fetch('http://www.ckk312.xyz:5000/api/readdocument', {
            method: 'POST',
            body: JSON.stringify({ collection: 'All Teams' , name: oldPlayer }),
            headers: header
        });

        result = await response.json();
    } catch (e) {
        console.error(e);
        return false;
    }

    try {
        const header = new Headers();
        header.append('Content-Type', 'application/json');

        const edit = await fetch('http://www.ckk312.xyz:5000/api/updatedocument', {
            method: 'POST',
            body: JSON.stringify({
                collection: 'All Teams', 
                _id: result.result._id, 
                username: newPlayer,
                game: result.result.Game,
                teamaffiliation: result.result.TeamAffiliation
            }),
            headers: header
        });

        const error = await edit.json();

        if (error.error !== '') {
            throw Error;
        }
    } catch (e) {
        console.error(e);
        return false;
    }

    return true;
}

// ----------------------------------------

export async function getRoster(title: string): Promise<any[]> {
    try {
        const header = new Headers();
        header.append('Content-Type', 'application/json');

        const response = await fetch('http://www.ckk312.xyz:5000/api/searchdocuments', {
            method: 'POST',
            body: JSON.stringify({ collection: 'All Teams' , query: title + ' Knights', searchKeys: ['Game'] }),
            headers: header
        });

        const result = await response.json();
        return result.result;
    } catch (e) {
        console.error(e);
        return [];
    }
}

// ----------------------------------------

export async function getMatches(title: string, teamAffiliation: string): Promise<any[]> {
    
    try {
        const header = new Headers();
        header.append('Content-Type', 'application/json');

        const response = await fetch('http://www.ckk312.xyz:5000/api/searchdocuments', {
            method: 'POST',
            body: JSON.stringify({ collection: 'MatchInfo', query: title + teamAffiliation}),
            headers: header
        });

        const result = await response.json();
        //.log(result);
        return result.result;
    } catch (e) {
        //console.error(e);
        return [];
    }
}

export function getFutureMatches(matches: any[]) {
    // Get the current time in milliseconds

    // Step 1: Map the matches to include the time difference from the current date
    const matchesWithTimeDifference = matches
        .map((match: any) => {
            const matchDate = new Date(match.item.Date*1000); // Convert Unix timestamp to Date object
            const timeDifference = (matchDate.getTime() - Date.now());

            //console.log("Current Time:", Date.now()); // Log the current time
            //console.log("Match Date:", matchDate); // Log the match date
            //console.log("Time Difference:", timeDifference); // Log the time difference

            // Only return matches that are in the future
            if (timeDifference > 0) {
                return { ...match.item, date: matchDate, timeDifference }; // Return match with time difference
            } else {
                return null; // Exclude past matches
            }
        })
        .filter((match: any) => match !== null); // Filter out any null (past matches)

    // Step 2: Sort the future matches by the smallest time difference (ascending order)
    const sortedFutureMatches = matchesWithTimeDifference.sort((a: any, b: any) => a.timeDifference - b.timeDifference);

    // Step 3: Return all future matches
    return sortedFutureMatches;
}