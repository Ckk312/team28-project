import type { Player, Match } from '../../types/'

// helper file
// sorted by player functions -> team functions -> match functions

export async function updateName(oldPlayer: string, newPlayer: Player): Promise<boolean> {
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
                username: newPlayer.Username,
                game: result.result.Game,
                teamaffiliation: result.result.TeamAffiliation,
                img: result.result.Img || '',
                clubstatus: newPlayer.ClubStatus,
                description: newPlayer.Description || '',
                maincharacter: newPlayer.MainCharacter || '',
                rank: newPlayer.Rank || '',
                role: newPlayer.Role || ''
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
        return (result.result);
    } catch (e) {
        console.error(e);
        return [];
    }
}

// ----------------------------------------

export async function getMatches(game: string, teamAffiliation: string): Promise<Match[]> {
    
    try {
        const header = new Headers();
        header.append('Content-Type', 'application/json');

        const response = await fetch('http://www.ckk312.xyz:5000/api/searchdocuments', {
            method: 'POST',
            body: JSON.stringify({ collection: 'MatchInfo', query: game }),
            headers: header
        });

        const searchres = await response.json();
        const result = searchres.map((match : Match) => {
            if (match.HomeTeam === teamAffiliation)
                return match;
        });

        //.log(result);
        return (result as Match[]);
    } catch (e) {
        //console.error(e);
        return [];
    }
}

export function getFutureMatches(matches: Match[]) {
    // Get the current time in milliseconds

    // Step 1: Map the matches to include the time difference from the current date
    const matchesWithTimeDifference = matches
        .map((match: Match) => {
            const matchDate = new Date(match.Date*1000); // Convert Unix timestamp to Date object
            const timeDifference = (matchDate.getTime() - Date.now());

            //console.log("Current Time:", Date.now()); // Log the current time
            //console.log("Match Date:", matchDate); // Log the match date
            //console.log("Time Difference:", timeDifference); // Log the time difference

            // Only return matches that are in the future
            if (timeDifference > 0) {
                return { ...match, date: matchDate, timeDifference }; // Return match with time difference
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

// ----------------------------------------
export function spaceUppercase(text: string) : string {
    if (text.length === 0 || !text) {
        return "";
    }

    let res = text;
    let offset = 0;
    for (let i = 1; i < (text.length); i++) {
        if (!/[A-Zo\d]/.test(text.charAt(i))) {
            continue;
        }

        if (text.charAt(i) === 'o' && (i < (text.length - 1) && text.charAt(i + 1) !== 'f')) {
            continue;
        }

        res = res.slice(0, i + offset) + ' ' + res.slice(i + offset);
        offset++;
    }

    return res;
}