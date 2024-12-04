import React, { useState } from 'react';
import { MatchInfo, PlayerInfo, TeamInfo } from '../../types/schemas';

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
	const teamType = (props.team == 'A' || props.team == 'B') ? 0 : 1;
	let team: TeamInfo = { teamName: "Example Team", players: [{ username: "Exampl Player "}]};
	NodeCG.waitForReplicants(matchInfo).then(() => { team = matchInfo.value!.teams[teamType]; });
	const [size, setSize] = useState<number>(team.players.length);
	const [teamPlayerValue, setTeamPlayerValue] = useState<PlayerInfo[]>(team.players);
	const [isDisabled, setIsDisabled] = useState<boolean>(false);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) : void => {
		e.preventDefault();
		nodecg!.sendMessage('updateTeamPlayers', {players: teamPlayerValue, type: teamType});
	}

	const InputCreator = (props: any) => {
		const [term, setTerm] = useState(teamPlayerValue[props.index].username);

		return (
			<input
				id={ divId + '-' + (props.index + 1) }
				type="text"
				placeholder={ 'Player ' + (props.index + 1) }
				value={ term }
				onChange={ (e) => { setTerm(e.target.value ) }}
			/>
		)
	}

	const InputRender = (props: any) => {
		const arr = Array(props.size).fill(0);
		return (
			<label className="team-list-label">{team.teamName}
				{ arr.map((player, index) => {
					return <InputCreator key={index} index={index}/>;
				}) }
			</label>
		);
	}

	const divId = 'team-list-' + props.team;
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
								if (oldVal.length > 1) {
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
