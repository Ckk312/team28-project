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

export async function getAllUsers(allGames: string[]): Promise<any[]> {
    const header = new Headers();
    header.append('Content-Type', 'application/json');

    const allTeams: any[] = [];

    try {
        for (const game of allGames) {
            const response = await fetch('http://www.ckk312.xyz:5000/api/searchdocuments', {
                method: 'POST',
                headers: header,
                body: JSON.stringify({
                    collection: 'All Teams',
                    query: `${game} Knights`,
                    searchKeys: ['Game'],
                })
            });

            const result = await response.json();

            if (result?.result?.length > 0) {
                allTeams.push(...result.result);
            } else {
                console.warn('No results found for game: ' + game);
            }
        }

        return allTeams;
    } catch (e) {
        console.error('Error fetching team data:', e);
        return [];
    }
}

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

    console.log("Reaches Here");
    
    try {
        const header = new Headers();
        header.append('Content-Type', 'application/json');

        const response = await fetch('http://www.ckk312.xyz:5000/api/searchdocuments', {
            method: 'POST',
            body: JSON.stringify({ collection: 'MatchInfo', query: game}),
            headers: header
        });

        const searchres = await response.json();
        console.log("list of matches");
        console.log(searchres);
        console.log("list of matches 2");
        console.log(searchres.result);
        console.log(teamAffiliation);
        const result: Match[] = searchres.result.filter((match : Match) => (match.HomeTeam === teamAffiliation) && (match.Game === game));
        console.log("Returned Matches");
        console.log(result);
        return (result);
    } catch (e) {
        //console.error(e);
        return [];
    }
}

export function getFutureMatches(matches : Match[]) {
    // Get the current time in milliseconds
    console.log("List of Possible Future Matches");
    console.log(matches)

    // Step 1: Map the matches to include the time difference from the current date
    const futureMatches = matches
        .map((match: Match) => {
            const matchDate = new Date(match.Date * 1000); // Convert Unix timestamp
            const timeDifference = matchDate.getTime() - Date.now();

            return timeDifference > 0
                ? { ...match, date: matchDate, timeDifference }
                : null; // Exclude past matches
        })
        .filter(Boolean) // Remove null values
        .sort((a: any, b: any) => a.timeDifference - b.timeDifference); // Sort by time difference

        console.log("Future Match");
        console.log(futureMatches);

    return futureMatches;
}

export function getPastMatches(matches : Match[]) {
    // Get the current time in milliseconds
    console.log("List of Possible Future Matches");
    console.log(matches)

    // Step 1: Map the matches to include the time difference from the current date
    const pastMatches = matches
        .map((match: Match) => {
            const matchDate = new Date(match.Date * 1000); // Convert Unix timestamp
            const timeDifference = matchDate.getTime() - Date.now();

            return timeDifference < 0
                ? { ...match, date: matchDate, timeDifference }
                : null; // Exclude past matches
        })
        .filter(Boolean) // Remove null values
        .sort((a: any, b: any) => b.timeDifference - a.timeDifference); // Sort by time difference

        console.log("Past Match");
        console.log(pastMatches);

    return pastMatches;
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

// ----------------------------------------

export function sortClubStatus(players : Player[]): Player[] {
    return players.sort((a, b) => {
        if (a.ClubStatus === b.ClubStatus)
            return a.Username.localeCompare(b.Username);
        return a.ClubStatus!.localeCompare(b.ClubStatus!);
    })
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