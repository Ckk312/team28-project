// helper file
// sorted by player functions -> team functions -> match functions

export async function updateName(oldPlayer: string, newPlayer: {username: string; role: string} ): Promise<boolean> {
    let result;
    // Log that the API request has started
    console.log('Beginning updateName...');
    try {
        const header = new Headers();
        header.append('Content-Type', 'application/json');

        const response = await fetch('http://www.ckk312.xyz:5000/api/readdocument', {
            method: 'POST',
            body: JSON.stringify({ collection: 'All Teams' , name: oldPlayer }),
            headers: header
        });

        result = await response.json();

        // Log the result for debugging
        console.log('API Response:', result);
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
                username: newPlayer.username,
                role: newPlayer.role,
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

        const query = JSON.stringify({ collection: 'All Teams' , query: title + ' Knights', searchKeys: ['Game'] });

        console.log('Query:', query);

        const response = await fetch('http://www.ckk312.xyz:5000/api/searchdocuments', {
            method: 'POST',
            body: query,
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

    // Log that the query used
    console.log('Query:', title + teamAffiliation);

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
    // Log that the function has started
    //console.log('Beginning getFutureMatches...');

    // Get the current time in milliseconds

    // Step 1: Map the matches to include the time difference from the current date
    const matchesWithTimeDifference = matches
        .map((match: any) => {
            //console.log(match);

            // Validate the match object and date
            if (!match || typeof match !== 'object') {
                console.warn('Invalid match type:', match);
                return null; // Exclude any invalid matches
            }
            if (!match.Date || typeof match.Date !== 'number') {
                console.warn('Invalid match date:', match.Date);
                return null; // Exclude any matches with invalid dates
            }

            // Get the date4 of the match and calculate the time difference
            const matchDate = new Date(match.Date*1000);
            const timeDifference = (matchDate.getTime() - Date.now());

            // Only return matches that are in the future
            if (timeDifference > 0) {
                // Log the match with time difference for debugging
                //console.log('Match with Time Difference:', match, timeDifference);
                return { ...match, date: matchDate, timeDifference }; // Return match with time difference
            } else {
                //console.log('Match is in the past:', match, timeDifference);
                return null; // Exclude past matches
            }
        })
        .filter((match: any) => match !== null); // Filter out any null (past matches)

    // Log the matches with time difference for debugging
    //console.log('Matches with Time Difference:', matchesWithTimeDifference);

    // Step 2: Sort the future matches by the smallest time difference (ascending order)
    const sortedFutureMatches = matchesWithTimeDifference.sort((a: any, b: any) => a.timeDifference - b.timeDifference);

    // Step 3: Return all future matches
    return sortedFutureMatches;
}
export async function getAllUsers(allGames: string[]): Promise<any[]> {
    const header = new Headers();
    header.append('Content-Type', 'application/json');

    // Container for all team results
    const allTeams: any[] = [];

    try {
        // Fetch data for each game in allGames
        for (const game of allGames) {
            const response = await fetch('http://www.ckk312.xyz:5000/api/searchdocuments', {
                method: 'POST',
                headers: header,
                body: JSON.stringify({
                    collection: 'All Teams',
                    query: `${game} Knights`, // Assuming the query format includes 'Knights'
                    searchKeys: ['Game'], // Adjust as needed based on the backend implementation
                }),
            });

            const result = await response.json();

            if (result?.result?.length > 0) {
                // Add the results for the current game to the allTeams array
                allTeams.push(...result.result);
            } else {
                console.warn(`No results found for game: ${game}`);
            }
        }

        return allTeams;
    } catch (e) {
        console.error("Error fetching team data:", e);
        return [];
    }
}

export async function getUserTeams(username : string): Promise<any[]> {
    console.log('Beginning getUserTeams...');
    const response = await fetch('http://www.ckk312.xyz:5000/api/searchdocuments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            collection: 'All Teams',
            query: username,
            searchKeys: ['Username'],
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user games');
    }

    const data = await response.json();
    console.log('API Response:', data);
    return data.result || [];
}
