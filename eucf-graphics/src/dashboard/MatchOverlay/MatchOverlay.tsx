import React, { useState } from 'react';
import { MatchInfo, PlayerInfo, TeamInfo } from '../../types/schemas';

const matchInfo = nodecg.Replicant<MatchInfo>('matchInfo');

export function Panel() {
	return (
		<>
			<div id="team-info-root">
				<Score team="A" />
				<Score team="B" />
			</div>
		</>
	);
}

function Score(props: any) {
	let team: number = (props.team == 'A' || props.team == 'B' ? 0 : 1);
	let score: {teamAScore: number, teamBScore: number} = { teamAScore: 0, teamBScore: 0};
	NodeCG.waitForReplicants(matchInfo).then(() => { score = matchInfo.value!.score; });
	const [scoreValue, setScoreValue] = useState<{ teamAScore: number, teamBScore: number}>(score);
	const [isDisabled, setIsDisabled] = useState<boolean>(true);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) : void => {
		e.preventDefault();
		nodecg!.sendMessage('updateScore', score);
	}

	const divId = 'team-list-' + props.team;
	return (
		<>
			<div id={ divId }>
				<form className="team-list-form" onSubmit={handleSubmit}>
					<input type="submit" />
				</form>
				<div className="change-score-box" id={ 'change-score-box-side-' + props.team }>
					<button
						className="score-increase-button"
						type="button"
						onClick={ e => {
							e.preventDefault();
							setScoreValue((oldVal) => {
								const newVal = oldVal
								if (team)
									newVal.teamBScore++;
								else
									newVal.teamAScore++;
								return newVal;
							}
						)}}
					>Increment</button>
					<button
						className="score-decrease-button"
						type="button"
						disabled={ isDisabled }
						onClick={ e => {
							e.preventDefault();
							setScoreValue((oldVal) => {
								const newVal = oldVal
								if (team)
									newVal.teamBScore--;
								else
									newVal.teamAScore--;
								return newVal;
						})}}
					>Decrement</button>
				</div>
			</div>
		</>
	);
}
