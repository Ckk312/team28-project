import React, { useState } from 'react';
import { MatchInfo } from '../../types/schemas';

const matchInfoReplicant = nodecg.Replicant<MatchInfo>('matchInfo');

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
	const team = matchInfoReplicant.value?.teams[teamType]!;
	let teamsPlayers = team.players;

	const [playersList, setPlayersList] = useState(teamsPlayers);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) : void => {
		e.preventDefault();
		teamsPlayers = playersList;
	}

	const divId = 'team-list-' + props.team;
	return (
		<>
			<div id={ divId }>
				<form className="team-list-form" onSubmit={handleSubmit}>
					{ playersList?.map((player, index) => {
						return (
							<>
								<label className="team-list-label">{ team.teamName }
									<input
										id={ divId + '-' + index }
										type="text"
										placeholder={ player.username }
										value={ player.username }
										onChange={ (e) => setPlayersList((players) => {
											const list = [...players];
											list[index].username = e.target.value;
											return list;
										})}
									/>
								</label>
								<input type="submit" />
							</>
						)
					}) }
				</form>
			</div>
		</>
	);
}
