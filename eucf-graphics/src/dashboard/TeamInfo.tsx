import React, { useEffect, useState } from 'react';
import { MatchInfo, PlayerInfo, TeamInfo } from '../types/schemas';

const matchInfo = nodecg.Replicant<MatchInfo>('matchInfo');

export function Panel() {
	return (
		<>
			<div id="team-info-root">
				<TeamPlayers team="A" />
				<TeamPlayers team="B" />
			</div>
		</>
	);
}

function TeamPlayers(props: any) {
	const teamType = (props.team == 'A') ? 0 : 1;
	let firstTeam: TeamInfo = { teamName: "Example Team", players: [{ username: "Example Player "}]};
	NodeCG.waitForReplicants(matchInfo).then(() => {
		firstTeam = matchInfo.value!.teams[teamType];
	});
	const [size, setSize] = useState<number>(firstTeam.players.length);
	const [team, setTeam] = useState<TeamInfo>(firstTeam);
	const [teamPlayerValue, setTeamPlayerValue] = useState<PlayerInfo[]>(firstTeam.players);
	const [isDisabled, setIsDisabled] = useState<boolean>(false);
	const divId = 'team-list-' + props.team;

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) : void => {
		e.preventDefault();
		nodecg!.sendMessage('updateMatchTeamName', {name: team.teamName, type: teamType});
		nodecg!.sendMessage('updateTeamPlayers', {players: teamPlayerValue, type: teamType});
	}

	const InputCreator = (props: any) => {
		const [player, setPlayer] = useState(teamPlayerValue[props.index]);

		return (
			<input
				id={ divId + '-' + (props.index + 1) }
				type="text"
				placeholder={ 'Player ' + (props.index + 1) }
				value={ player.username }
				onChange={ (e) => { 
					setPlayer((oldVal) => {
						const newVal = {...oldVal};
						newVal.username = e.target.value;
						teamPlayerValue[props.index] = newVal;
						return newVal;
					});
				}}
			/>
		)
	}

	const InputRender = (props: any) => {
		const [name, setName] = useState(team.teamName);

		const arr = Array(props.size).fill(0);
		return (
			<label className="team-list-label">
				<input className="team-list-name"
					id={ divId + '-input' }
					type="text"
					placeholder="Example Team"
					value={ name }
					onChange={ (e) => {
						setName(e.target.value);
						setTeam((oldVal) => {
							const newVal = {...oldVal};
							newVal.teamName = name;
							return newVal;
						});
						//team.teamName = name;
					}}
				/>
				{ arr.map((player, index) => {
					return <InputCreator key={index} index={index}/>;
				}) }
			</label>
		);
	}

	/*const TeamImport = (props: any) => {
		const [query, setQuery] = useState<string>('');
		const xhr = new XMLHttpRequest();

		const importSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
			let teamList: any[] = [];
			e.preventDefault();
			xhr.open('POST', 'http://www.ckk312.xyz:5000/api/searchplayers');
			xhr.setRequestHeader('Content-type', 'application/json');
			xhr.onreadystatechange = () => {
				if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
					const response = JSON.parse(xhr.responseText);
					if (!response && !response.result) {
						return;
					}
					teamList = response.result;
					console.log('teamList is ' + teamList);

					if (teamList.length === 0) {
						return;
					}
		
					console.log(teamList);
		
					setTeam((oldVal) => {
						if (teamList.length === 0) {
							return oldVal;
						}
						const newVal = {...oldVal};
						newVal.teamName = 'UCF ' + teamList[0].TeamAffiliation;
						return newVal;
					});
					
					setTeamPlayerValue(() => {
						setSize(teamList.length);
						return teamList.map((player) => {
							return { username: player.Username };
						});
					});
		
					nodecg!.sendMessage('updateMatchTeamName', {name: team.teamName, type: teamType});
					nodecg!.sendMessage('updateTeamPlayers', {players: teamPlayerValue, type: teamType});
				}
			}

			xhr.send(JSON.stringify({ query: query }));
		}

		const gamesList: string[] = ['Apex Legends Players', 'Call of Duty', 'League of Legends', 'Overwatch 2 Players', 'Rainbow Six Siege', 'Smash Bros.', 'Splatoon Players', 'Valorant Players'];
		const dataList: string[] = [];

		gamesList.map((game) => {
			dataList.push(game + ' Knights');
			dataList.push(game + ' Knights Academy');
			if (game === 'Valorant') {
				dataList.push(game + ' Knights Rising');
				dataList.push(game + ' Knights Pink');
			}
		})

		return (
			<>
				<form id="import-form" onSubmit={importSubmit}>
					<input list="import-teams" 
						id="team-import-input" 
						name="team-import-choice"
						type="search"
						placeholder="Search teams"
						value={ query }
						onChange={ (e) => { setQuery(e.target.value )}}
					/>
					<input type="submit" value="Import" />
				</form>

				<datalist id="import-teams">
					{ dataList.map((data, index) => {
						return (
							<option value={data} key={index}/>
						)
					}) }
				</datalist>
			</>
		);
	}*/

	return (
		<>
			<div id={ divId }>
				<form className="team-list-form" onSubmit={handleSubmit}>
					<InputRender size={size}/>
					<input type="submit" />
				</form>
				<div className="change-player-box" id={ 'change-player-box-side-' + props.team }>
					<button
						className="create-player-button"
						type="button"
						onClick={ e => {
							e.preventDefault();
							setTeamPlayerValue((oldVal) => {
								if (oldVal.length === 1) {
									setIsDisabled(false);
								}
								const newVal = [...oldVal];
								newVal.push({ username: '' });
								setSize(newVal.length);
								return newVal;
							}
						)}}
					>Increment</button>
					<button
						className="delete-player-button"
						type="button"
						disabled={ isDisabled }
						onClick={ e => {
							e.preventDefault();
							setTeamPlayerValue((playerList) => {
								if (playerList.length === 2) {
									setIsDisabled(true);
								}
								if (playerList.length < 2) {
									return playerList;
								}
								const newList = [...playerList];
								newList.pop();
								setSize(newList.length);
								return newList;
						})}}
					>Decrement</button>
				</div>
			</div>
		</>
	);
}
